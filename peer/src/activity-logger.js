
const fs = require('fs');
const wstream = fs.createWriteStream("activity.log", { flags: "a" });

const Tail = require('tail').Tail;

wstream.on('open', () => {
    new Tail("activity.log").on('line', data => {
        let list = data.split(' ');
        if (list.length > 0) {
            logicalTime.latest = list[0];
        }
    });
});


const logicalTime = {
    latest: 0
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