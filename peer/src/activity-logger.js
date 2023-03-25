
const { time } = require('console');
const fs = require('fs');
const wstream = fs.createWriteStream("activity.log");
const rstream = fs.createReadStream("activity.log", 'utf8');

let logicalTime = 0;

const writeLog = (message) => {
    console.log(message);

    wstream.write(message, (err) =>{
        if(err){
            console.log(err.message);
        }
    })
    updateLogicalTime();
}


const updateLogicalTime = () => {
    //read latest line
    const lastLine = '';
    rstream.on('line', function(line) {
        if (line == '' || line == require("os").EOL) {
            lastLine = line;
        
            return;
        }

        
         //get latest time
    });


    //get latest time
  


    
    console.log(typeof(lastLine));
    const arr = lastLine.split(' ');
    console.log(arr);
    //update time to max + 1
}


module.exports = {
    writeLog
}