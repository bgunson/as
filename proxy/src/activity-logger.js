
const fs = require('fs');
const wstream = fs.createWriteStream("activity.log");

let logicalTime = 0;

const writeLog = (message) => {
    console.log(message);
    wstream.write(message, (err) =>{
        if(err){
            console.log(err.message);
        }
    })
}

module.exports = {
    writeLog
}