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
const registerHandlers = require('./src/handlers');

const port = process.env.PORT || 3000;

app.enable("trust proxy");

app.set('io', io);
app.set('peers', peers);    // this is so we can access the peer list in http endpoints e.g. req.app.get('peers') returns this object
app.use(routes);

/**
 * TODO: replace this with:
 * app.use(express.static('public')); // to serve the public folder containing html/js/css
 */
app.get('/', (req, res) => {
    res.send("Welcome to adshare!\n\nWe are a distributed marketing platform where your ad will get noticed. Blah blah blah...");
});

/**
 * Handle a peer connecting via ws
 * @param {Socket} socket 
 */
const onConnection = (socket) => {
  registerHandlers(io, socket, peers);
}

io.on("connection", onConnection);


server.listen(port, () => {
  console.log('listening on *:3000');
});