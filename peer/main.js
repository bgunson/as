const { io } = require("socket.io-client");
const fs = require("fs");

const socket = io(`https://amazing-limiter-378022.uw.r.appspot.com`);

socket.on("error", (err) => console.log(err));

socket.on("give-peer-list", (list) => {
    peers = list;
    console.log(`I am: ${socket.id}`);
    console.log(peers);
    console.log("===")
});

socket.on("connect", () => {
    console.log("Proxy connection established.");
    socket.emit("get-peer-list");
});

//
socket.on("get-ad", () => {
    //Choose the ad that will be sent to the proxy by selecting a random file
    const path = require('path');
    //Assumes we keep file in ./as/peer/ads
    const dirPath= path.join(__dirname,'ads');
    //Access files in path
    const files = fs.readdirSync(dirPath)
    //Picks a random file up to number of files
    const randomFile = files[Math.floor(Math.random() * files.length)];
  
    //Transmit local ad as file
    //fs.readFile( filepath, function(error, filedata))
    fs.readFile(path.join(dirPath, randomFile), (err, data) => {
        if (!err) {
            console.log("Transmitting ad: " + randomFile + "to proxy...");
            socket.emit("give-ad", randomFile, data);
        } else{
            //NB: With nodemon running both proxy and server instances, error transmitting puts client page to perma-reloading with no ad rip
            //Fix^ and have to also get client to refresh and get proper ad 
            console.log("Error transmitting ad to proxy! Check ad config settings!");
        }
    });
});