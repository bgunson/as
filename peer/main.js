const { io } = require("socket.io-client");
const fs = require("fs");

const socket = io(`http://localhost:${process.env.PORT || 3000}`);


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
    // choose the ad that will be sent to the proxy
    const name = 'some-ad.jpg';     // TODO: implement some sort of picking function or whatever
    const adName = 'ad1.png'
    const adName2 = 'some-a.jpg';

    //Transmit local ad as file
    //fs.readFile( filepath, function(error, filedata))
    fs.readFile(`./${adName}`, (err, data) => {
        if (!err) {
            console.log("Transmitting ad: " + name + "to proxy...");
            socket.emit("upload-ad", name, data);
        }
        else{
            //NB: With nodemon running both proxy and server instances, error transmitting puts client page to perma-reloading with no ad rip
            //Fix^ and have to also get client to refresh and get proper ad 
            console.log("Error transmitting ad to proxy! Check ad config settings!");
        }
    });
});