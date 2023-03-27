const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
  maxHttpBufferSize: 3e6  // 3MB (ad file) max message size
});
const chalk = require('chalk');
var log = require('fancy-log');

const routes = require('./src/routes');

// set up peer list object
const Peers = require('./src/peers');
const peers = new Peers();

// socket.io event handlers for peers
const registerHandlers = require('./src/handlers');

// for lamport time sync - see src/activity-logger
const { syncronize } = require('./src/activity-logger');

const port = process.env.PORT || 3000;

app.enable("trust proxy");

app.set('io', io);
app.set('peers', peers);    // this is so we can access the peer list in http endpoints e.g. req.app.get('peers') returns this object
app.use(routes);


app.use(express.static('public'));

const syncInterval = setInterval(async () => {
  const synced = await syncronize(peers); 
  if (synced) {
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
  log(chalk.bold(`Proxy live and listening at: ${port}`));
});