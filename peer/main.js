/**
 * @file Client-side code for communicating with the proxy server.
 * Peer (aka host) will stores and serves ad images to the proxy server.
 * Main objective of peer: Wait for 'get-ad' event. Select a random (available) ad and send it to the proxy server.
 * Proxy will then send the received ad image to the client.
 */

//Load env vars from .env file into process.env vars here
require('dotenv').config();
const { io } = require("socket.io-client");
const fs = require("fs");
//Define url of server to which this peer will connect to!
const serverURL = process.env.SERVER_URL; 

if (process.env.NODE_ENV === 'development'){
    console.log("Peer running in dev. mode.");
} else if (process.env.NODE_ENV === 'production'){
    console.log("Peer running in prod. mode.");
}else {
    //....
    console.log("Peer running in FULL SEND mode.");
}

//Create WS connection b/w client and server (init. client instance)
const socket = io(serverURL);

socket.on("error", (err) => console.log(err));

socket.on("give-peer-list", (list) => {
    peers = list;
    console.log(`Current peer instance ID is: ${socket.id}\n`);
    console.log(`List of all current active peers in this swarm:`);
    console.log(peers);
    console.log("===")
});

socket.on("connect", () => {
    console.log(`Proxy connection established. Connected to ${serverURL}`);
    socket.emit("get-peer-list");
});

socket.on("disconnect", ()=>{
    console.log(`Disconnected from ${serverURL}!`);
})

// 'get-ad' event called by proxy server, choose random ad from folder and send it
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
            console.log("Transmitting ad: " + randomFile + " to proxy...");
            socket.emit("give-ad", randomFile, data);
        } else{
            //NB: With nodemon running both proxy and server instances, error transmitting puts client page to perma-reloading with no ad rip
            //Fix^ and have to also get client to refresh and get proper ad 
            console.log("Error transmitting ad to proxy! Check ad config settings!");
        }
    });
});