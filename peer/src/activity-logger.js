
const fs = require('fs');
const wstream = fs.createWriteStream("activity.log", { flags: "a" });

const logicalTime = {
    latest: 0,
    getLatest: () => {
        // TODO: read last line of file, parse logical timestamp
        return Math.round(Math.random() * 69)
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