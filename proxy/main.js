const express = require('express');
const { writeFile, readFile, ftruncate } = require('fs');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const os = require('os');
const { isValidType } = require('./src/validators');

const port = process.env.PORT || 3000;
const serverURL = process.env.NODE_ENV === 'production' ? `https://amazing-limiter-378022.uw.r.appspot.com` : `http://localhost:${port}`;   // default is dev 

// cache of currently active (connected) servers
const peers = {};

app.get('/', (req, res) => {
  res.send("Welcome to adshare!\n\nWe are a distributed marketing platform where your ad will get noticed. Blah blah blah...");
});

app.get('/ad', (req, res) => {

    // choose random server
    const peerId = Object.keys(peers)[Math.floor(Math.random() * Object.keys(peers).length)];
    
    // get the socket ref of the chosen server
    const socket = peers[peerId];

    if (!socket) {
        // no servers online
        console.log("ERROR: No peers online! Serving default ad!");
        res.sendFile(`bad2.png`, {root: `./backup_ads`});
        return;
    }
    
    socket.emit("get-ad");  // tell them we want an ad
    // wait for the stream
    socket.once("give-ad", (fName, stream) => {

        // test file name from peer
        const fType = isValidType(fName);
        
        // if fType is undefined (not valid image or asset) bad, else forward to client 
        if (!fType) {
            // fallabck here or re-request
            res.sendStatus(404);    // Not Found
        } else {
            res.set('Content-Type', `image/${fType}`);
            res.send(stream);
        }    

    });

});

io.on("connection", (socket) => {
  
    console.log(`${socket.id} connected`);
    // store a reference to this server's socket. (note servers are just socket.io clients)
    peers[socket.id] = socket;

    socket.on("disconnect", () => {
        console.log(`${socket.id} disconnected`)
        // this server disconected, remove from local cache so they wont be picked next time a client hails an ad
        delete peers[socket.id];
        io.emit("give-peer-list", Object.keys(peers))
    });


    socket.on("replicate", (ad) => {
        // TODO: choose another peer to be replicated to
    });

    socket.on("get-peer-list", () => {
        io.emit("give-peer-list", Object.keys(peers));
    });

});


server.listen(process.env.PORT || 3000, () => {
  console.log('listening on *:3000');
});