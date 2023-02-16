const { io } = require("socket.io-client");
const fs = require("fs");

const socket = io(`http://localhost:${process.env.PORT || 3000}`);


socket.on("error", (err) => console.log(err));

socket.on("connect", () => {
    console.log("connected to proxy");
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