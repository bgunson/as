const { io } = require("socket.io-client");
const fs = require("fs");

const socket = io(`https://amazing-limiter-378022.uw.r.appspot.com`);

let peers;

socket.on("error", (err) => console.log(err));

socket.on("give-peer-list", (list) => {
    peers = list;
    console.log(`I am: ${socket.id}`);
    console.log(peers);
    console.log("===")
});

socket.on("connect", () => {
    console.log("connected to proxy");
    socket.emit("get-peer-list");
});

socket.on("get-ad", () => {
    
    // choose the ad that will be sent to the proxy
    const name = 'some-ad.jpg';     // TODO: implement some sort of picking function or whatever

    fs.readFile(`./${name}`, (err, data) => {
        if (!err) {
            socket.emit("give-ad", name, data);
        }
    });
});