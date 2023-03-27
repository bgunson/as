const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  maxHttpBufferSize: 3e6  // 3MB (ad file) max message sixe
});

const routes = require('./src/routes');

// set up peer list object
const Peers = require('./src/peers');
const peers = new Peers();

// socket.io event handlers for peers
const registerHandlers = require('./src/handlers');

// for lamport time sync - see src/activity-logger
const { logicalTime } = require('./src/activity-logger');

const port = process.env.PORT || 3000;

app.enable("trust proxy");

app.set('io', io);
app.set('peers', peers);    // this is so we can access the peer list in http endpoints e.g. req.app.get('peers') returns this object
app.use(routes);


app.use(express.static('public'));

let syncInterval = setInterval(async () => {
  if (peers.all.length > 0) {
    // wait for all connected peers to resolve their local lamport timestamp
    let ts = await Promise.all(peers.all.map(socket => {
      return new Promise(resolve => socket.emit('get-latest-log-time', resolve));
    }));
    
    // Sync our local ts given the current peers'
    await logicalTime.updateLatestLogTime(ts);
    
    // Now, we can assume the local ts is up to date
    clearInterval(syncInterval);
  }

}, 5000);


/**
 * Handle a peer connecting via ws
 * @param {Socket} socket 
 */
const onConnection = (socket) => {
  registerHandlers(io, socket, peers);
}

io.on("connection", onConnection);

server.listen(port, () => {
  console.log(`listening on *: ${port}`);
});