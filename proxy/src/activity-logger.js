
const fs = require('fs');
const wstream = fs.createWriteStream("activity.log", { flags: "a" });

let msgBuffer = [];

const logicalTime = {
    latest: 0,
    isLatest: true,
}

let timeBuffer = [];
const updateLatestLogTime = (times) => {
    // TODO: set logger's logical time iff max(...ts)+1 > latest, and set isLatest to true
    // latest will always be 0 on startup, so maybe we should read this proxy's activity log and get the last
    timeBuffer.push(times);
    latest = Math.max(...timeBuffer);

    console.log(timeBuffer);

    latest += 1;

    console.log(latest);

    // TODO: fill in missing logs from peers in range [max(...ts)-latest .. max(...ts)]
}



const writeLog = (message) => {
    // buffer the message regardless if can write or not
    msgBuffer.push(message);

    // if we can write
    if (logicalTime.isLatest) {
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
    updateLatestLogTime
}