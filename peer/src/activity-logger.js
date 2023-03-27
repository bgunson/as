
const fs = require('fs');
const wstream = fs.createWriteStream("activity.log", { flags: "a" });

const readLastLines = require('read-last-lines');

const logicalTime = {
    latest: 0,
    getLatestFromLog: async () => {
        const lastline = (await readLastLines.read("activity.log", 1)).trimEnd();
        if (lastline.split(' ').length > 0) {
            // we can parse out a ts
            this.latest = lastline.split(" ")[0];
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
    const lines = await readLastLines.read("activity.log", nLines);
    return lines;
}

module.exports = {
    writeLog,
    getRangeFromLog,
    logicalTime
}