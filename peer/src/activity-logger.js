
const fs = require('fs');
const wstream = fs.createWriteStream("activity.log", { flags: "a" });

const readLastLines = require('read-last-lines');


const logicalTime = {
    latest: 0,
    getLatest: () => {
        // TODO: read last line of file, parse logical timestamp
        var latestTime = 0;
        while(latestTime == 0){
            readLastLines.read("activity.log", 1)
            .then((lines) => {
                console.log("latest timestamp = " + lines.split(" ")[0]);
                latestTime = lines.split(" ")[0];
            });
        }

        return latestTime;

    }
}

const writeLog = (message) => {
    // console.log(message);

    wstream.write(message, (err) =>{
        if(err){
            console.log(err.message);
        }
    })
    // updateLogicalTime();
}

module.exports = {
    writeLog,
    logicalTime
}