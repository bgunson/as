const { ledgerFileName } = require('./defaults');
const fs = require('fs');
const wstream = fs.createWriteStream(ledgerFileName, { flags: "a" });
const readLastLines = require('read-last-lines');

/**
 * Read from the ledger ignoring empty lines (excess newline chars)
 * @param {Number} n - the number of lines ot read 
 * @returns The last non empty line from the file, unless we have tried to read more lines than actually exist. 
 *          Else, recurse and read n+1 lines 
 */
const readUntilNotEmpty = async (n=1) => {
    const line = await readLastLines.read("activity.log", n);
    if (line.trimEnd().length > 0 || n > line.split('\n').length) {
        // base case: we tried to read more lines than in the file without finding a valid line so return whatever we have
        // or read a non empty line
        return line.trimEnd();
    } else {
        // Read again but increment the number of lines
        return readUntilNotEmpty(n+1);
    }   
}

const logicalTime = {
    latest: 0,
    getLatestFromLog: async () => {
        const lastline = await readUntilNotEmpty();
        if (lastline.split(' ').length > 0) {
            // we can parse out a ts
            this.latest = Number(lastline.split(" ")[0]);
        }
        return this.latest;
    }
}

const writeLog = (message) => {
    wstream.write(message, (err) =>{
        if(err){
            console.log(err.message);
        }
    });
}

/**
 * Get a range of lines (events) from the local activity.log 
 * @param {number} range - range of events needed i.e. timestamps from this log. e.g. [24, 30] means we need to 
 * parse the log file for lines w/ timestamp 24 though 30 (inclusive) and return them.
 * @returns events from the ledger in the range given.
 */
const getRangeFromLog = async (range) => {
    const nLines = range[1] - range[0];
    const lines = await readLastLines.read(ledgerFileName, nLines);
    return lines;
}

module.exports = {
    writeLog,
    getRangeFromLog,
    logicalTime
}