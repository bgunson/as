const express = require('express');
const { writeFile, readFile } = require('fs');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

// cache of currently active (connected) servers
const servers = {};

app.get('/', (req, res) => {
  res.send("Welcome to adshare!\n\nWe are a distributed marketing platform where your ad will get noticed. Blah blah blah...");
});

app.get('/ad', (req, res) => {

    // choose random server
    const serverId = Object.keys(servers)[Math.random() * (Object.keys(servers).length-1)];
    
    // get the socket ref of the chosen server
    const socket = servers[serverId];

    if (!socket) {
        // no servers online
        res.send("ERROR: no ad could be located");
        return;
    }
    
    socket.emit("get-ad");  // tell them we want an ad
    // wait for the stream
    socket.once("upload-ad", (id, stream) => {
        // cache the file on the fs on proxy machine
        const file = `/tmp/adshare-${id}`; 
        writeFile(file, stream, (err) => {
            if (!err) {
                res.sendFile(file);
            } else {
                console.log("something went wrong loading the ad")
                res.send(err);
            }
        });
        
    });
    

});

io.on("connection", (socket) => {
  
    console.log(`${socket.id} connected`);
    // store a reference to this server's socket. (note servers are just socket.io clients)
    servers[socket.id] = socket;

    socket.on("disconnect", () => {
        console.log(`${socket.id} disconnected`)
        // this server disconected, remove from local cache so they wont be picked next time a client hails an ad
        delete servers[socket.id];
    });

});


server.listen(process.env.PORT || 3000, () => {
  console.log('listening on *:3000');
});