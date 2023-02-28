const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);

const routes = require('./src/routes');

// set up peer list object
const Peers = require('./src/peers');
const peers = new Peers();

// socket.io event handlers for peers
const handle = require('./src/handlers');

const port = process.env.PORT || 3000;

app.set('peers', peers);    // this is so we can access the peer list in http endpoints e.g. req.app.get('peers') returns this object
app.use(routes);


/**
 * TODO: replace this with:
 * app.use(express.static('public')); // to serve the public folder containing html/js/css
 */
app.get('/', (req, res) => {
    res.send("Welcome to adshare!\n\nWe are a distributed marketing platform where your ad will get noticed. Blah blah blah...");
});

// peer handler middleware function
io.use((socket, next) => handle(socket, io, peers, next));

/**
 * A peer connected!
 */
io.on("connection", (socket) => {

    console.log(`${socket.id} connected`);
    // store a reference to this server's socket. (note servers are just socket.io clients)
    peers.addPeer(socket);

});


server.listen(port, () => {
  console.log('listening on *:3000');
});