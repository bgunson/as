
const fs = require('fs');
const readLastLines = require('read-last-lines');
const wstream = fs.createWriteStream("activity.log", { flags: "a" });

const  msgBuffer = [];

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
        const lastline = (await readLastLines.read("activity.log", 1)).trimEnd();
        if (lastline.split(' ').length > 0) {
            // we can parse out a ts
            this.latest = lastline.split(" ")[0];
        } 
        return this.latest;
    },

    /**
     * Sync local lamport timestamp to be max of times concat lastes from local log file (+1).
     * @param {number[]} peerTs - list of current timestamps from connected peers 
     */
    updateLatestLogTime: async (peerTs) => {
        // latest will always be 0 on startup, so maybe we should read this proxy's activity log and get the last
        const localLatest = await logicalTime.getLatestFromLog();
        const peerLatest = Math.max(...peerTs);
        // the latest will be the maximum of the peers or the latest from the log (could be 0 if no log on this proxy machine)
        logicalTime.latest = Math.max(peerLatest, localLatest);

        // TODO: fill in missing logs from peers in range
        // this will require additional proxy-peer coms asking them if they have anything in their logs with 
        // lamport ts in range [peerLatest-localLatest .. peerLatest]
        
        // next call to writeLog will flush msgBuffer AND increment it +1 so we do not need to excplicitly incr
        logicalTime.isSynced = true;  
        return logicalTime.latest; 
    },
}



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
            wstream.write(m, (err) =>{
                if(err){
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
    writeLog,
    logicalTime
}