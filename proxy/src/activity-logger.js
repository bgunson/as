
const fs = require('fs');
const wstream = fs.createWriteStream("activity.log");

let msgBuffer = [];

const logicalTime = {
    latest: 0,
    isLatest: false,
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
            logged.push(m)
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
    writeLog
}