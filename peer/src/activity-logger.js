
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
    // console.log(message);

    wstream.write(message, (err) =>{
        if(err){
            console.log(err.message);
        }
    });
    // updateLogicalTime();
}

module.exports = {
    writeLog,
    logicalTime
}