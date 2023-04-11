const { io } = require("socket.io-client");
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
var log = require('fancy-log');

require('dotenv').config();

const registerHandlers = require('./handlers');
const { writeLog, getRangeFromLog, logicalTime } = require('./activity-logger');
const { adDir } = require("./defaults");

// Read from env var file
const serverURL = process.env.SERVER_URL || `https://amazing-limiter-378022.uw.r.appspot.com`; 
const backup_serverURL1 = process.env.SERVER_URL_BACKUP_1 || `http://aspxy3.bhodrolok.xyz/`;
const backup_serverURL2 = process.env.SERVER_URL_BACKUP_2 || `http://aspxy5.bhodrolok.xyz/`;      

const SERVER_TIMEOUT_MS = process.env.CONN_TIMEOUT || 6000;
const RETRY_INTERVAL_MS = process.env.RETRY_INTERVAL_MS || 1234;
const NUM_RETRIES = process.env.NUM_RETRIES || 2;

class ProxyReplica {

    /**
     * Circular linked list for defined server URLs 
     */
    constructor() {
        this._index = 0; 
        this._backups = [serverURL, backup_serverURL1, backup_serverURL2].filter(b => b !== undefined);
    }

    next() {
        let current = this._backups[this._index];
        this._index = ++this._index % this._backups.length;
        return current;
    }
};

/**
 * Utility function to set up socket.io-client for connecting to proxy
 * @returns socket.io-client instance
 */
module.exports = () => {

    const proxyReplica = new ProxyReplica();    

    const socket = io(proxyReplica.next(), {
        transports: ['websocket'],              //https://stackoverflow.com/a/69450518; WebSocket over HTTP long polling
        autoConnect: false,                     
        reconnectionAttempts: NUM_RETRIES,      
        reconnectionDelay: RETRY_INTERVAL_MS,   
        timeout: SERVER_TIMEOUT_MS,             
        // see other options here: https://socket.io/docs/v4/client-options/
    });

    log(chalk.bold(`Connecting peer to: ${socket.io.uri}`));


    // register handlers with the peer socket
    const handlers = registerHandlers(socket);

    socket.on("connect_error", (err) => {
        log.error(chalk.bold.bgKeyword('red')(`${err.message}`));
    });

    socket.io.on("reconnect_failed", () => {
        log.info(`Max reconnects reached for: ${socket.io.uri} !`);
        socket.close();
        socket.io.uri = proxyReplica.next();      // advance to next backup
        log.info(`Swapping server urls to: ${socket.io.uri}`)
        socket.connect();
    });

    socket.on("connect", () => {
        log.info(chalk.bold(`Proxy connection established to: ${socket.io.uri}`));
        log.info('Fetching list of other peers in this swarm!');
        //request peer list from proxy server
        socket.emit("get-peer-list");
    });

    // Peer received `replicate` event from proxy server
    socket.on('replicate', handlers.uploadAd);

    // Peer received `delete-ad` event from proxy server
    socket.on('delete-ad', (id) => {
        // only delete if was not a user ad
        if (!handlers.whitelist.has(id)) {
            handlers.deleteAd(id);
        }
    });

    // Peer received `get-ad` event from proxy server; pick random local ad and send it to proxy server
    socket.on('get-ad', (name) => {
        const ad = handlers.getAd(name);
        if (ad) {
            handlers.giveAd(ad);
        }
    });

    socket.on('give-peer-list', handlers.updatePeerList);

    socket.on('want-ad', (id, cb) => {
        // do we need this ad?
        cb(!fs.existsSync(path.join(adDir, id)) && !handlers.blacklist.has(id));
    });

    socket.on('get-latest-log-time', async (respond) => {
        let latest = await logicalTime.getLatestFromLog();
        respond(latest);
    });

    socket.on('get-log-range', async (range, respond) => {
        let eventsInRange = await getRangeFromLog(range);
        respond(eventsInRange);
    });

    socket.on('activity-log-msg', (messages) => {
        writeLog(messages.join());
    });
    
    socket.connect();

    return handlers;
};
