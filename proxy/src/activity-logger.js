
const fs = require('fs');
const readLastLines = require('read-last-lines');
const Peers = require('./peers');
const wstream = fs.createWriteStream("activity.log", { flags: "a" });
wstream.on('open', (fd) => {
    console.log(fd)
})

const msgBuffer = [];

/**
 * Read from the ledger ignoring empty lines (excess newline chars)
 * @param {Number} n - the number of lines ot read 
 * @returns The last non empty line from the file, unless we have tried to read more lines than actually exist. 
 *          Else, recurse and read n+1 lines 
 */
const readUntilNotEmpty = async (n=1) => {
    const line = await readLastLines.read("activity.log", n);
    if (line.split('\n').length < n) {
        // base case: we tried to read more lines than in the file without finding a valid line so return empty line
        // prevents infinite recursion on empty files
        return line;
    } else if (!line.trim()) {
        return readUntilNotEmpty(n+1);
    }   
    return line;
}

const logicalTime = {
    /**
     * Local lamport timestamp; assume 0 but will be updated when 
     */
    latest: 0,

    /**
     * Initially false, on proxy startup we ask other peers to see who has the latest ts 
     * then set this flag to true which allows subsequent logs to be written with the correct ts
     */
    isSynced: false,

    /**
     * Grab the latest ts (last line) from local ledger
     * @returns 
     */
    getLatestFromLog: async () => {
        const lastline = await readUntilNotEmpty();
        if (lastline.split(' ').length > 0) {
            // we can parse out a ts
            this.latest = Number(lastline.split(" ")[0]);
        }
        return this.latest;
    },

    /**
     * Sync local lamport timestamp to be max of times concat lastes from local log file (+1).
     * @param {number[]} peerTs - list of current timestamps from connected peers 
     * @returns a 2 element list representing the range of missing logs from the local ledger
     */
    updateLatestLogTime: async (peerTs) => {
        // latest will always be 0 on startup, so maybe we should read this proxy's activity log and get the last
        const localLatest = await logicalTime.getLatestFromLog();
        const peerLatest = Math.max(...peerTs);
        // the latest will be the maximum of the peers or the latest from the log (could be 0 if no log on this proxy machine)
        logicalTime.latest = Math.max(peerLatest, localLatest);

        console.log(`Latest time determined to be ${logicalTime.latest}`)

        let missingRange;
        if (localLatest < peerLatest) {
            missingRange = [localLatest + 1, peerLatest];
            console.log(`We are missing events in the range ${missingRange} (inclusive)`);
        }

        // next call to writeLog will flush msgBuffer AND increment it +1 so we do not need to excplicitly incr
        return missingRange;
    }
}

/**
 * Try to sync local ts
 * @param {Peers} peers - currently connected peers 
 * @returns true if sync completed, false otherwise
 */
const syncronize = async (peers) => {
    if (peers.all.length > 0) {
        // wait for all connected peers to resolve their local lamport timestamp
        let ts = await Promise.all(peers.all.map(socket => {
            return new Promise(resolve => socket.emit('get-latest-log-time', resolve));
        }));

        // Sync our local ts given the current peers'
        const gap = await logicalTime.updateLatestLogTime(ts);

        if (gap) {
            const gaps = await Promise.all(peers.all.map(socket => {
                // peers respond with an array of messages (string) in the gap
                // note this could be a subset of the actual range specified
                return new Promise(resolve => socket.emit('get-log-range', gap, resolve));
            }));

            if (gaps.length > 0) {
                gaps.sort((a, b) => a.length > b.length);   
                // the most complete range will be one that has length equal or nearest gap[1]-gap[0]
                const missingLogs = gaps[0];
                wstream.write(missingLogs);  // TODO: make sure peers respond with messages including newline chars
            }
        }

        logicalTime.isSynced = true;
    }
    return logicalTime.isSynced;
}

/**
 * Write a message to the activity log (ledger)
 * @param {string} message - data to be written to file
 * @returns - a list of successfully logged messages
 */
const writeLog = (message) => {
    // buffer the message regardless if can write or not
    msgBuffer.push(message);

    // if we can write
    if (logicalTime.isSynced) {
        let logged = [];   // copy the current buffer to return

        // empty and write all messages in the buffer
        while (msgBuffer.length > 0) {
            let m = `${++logicalTime.latest} ${msgBuffer.pop()}`;
            logged.push(m);
            wstream.write(m, (err) => {
                if (err) {
                    console.log(err.message);
                }
            });
        }
        return logged;
    } else {
        return [];
    }
}

module.exports = {
    syncronize,
    writeLog,
    logicalTime
}