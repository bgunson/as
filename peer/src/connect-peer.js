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
const serverURL = process.env.SERVER_URL; 
const backup_serverURL1 = process.env.SERVER_URL_BACKUP_1;
const backup_serverURL2 = process.env.SERVER_URL_BACKUP_2;      

// Max time to wait for connection to be established with proxy server; default 7 seconds
const SERVER_TIMEOUT_MS = process.env.TIMEOUT || 7000;
const SERVER_TIMEOUT = SERVER_TIMEOUT_MS/1000; 

// Between each retry attempt connecting to same server; default 5 seconds
const RETRY_INTERVAL_MS = process.env.RETRY_INTERVAL_MS || 5000;
const RETRY_TIMEOUT = RETRY_INTERVAL_MS/1000;
// Number of tries to retry attempt connection to a server; default 3 tries
const NUM_RETRIES = process.env.NUM_RETRIES || 3;

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
        autoConnect: false,                     // connect is called at bottom
        reconnectionAttempts: NUM_RETRIES,      // num attempts to connect to a given replica (NUM_RETRIES)
        reconnectionDelay: RETRY_INTERVAL_MS,   // delay between each reconnect attempt
        timeout: SERVER_TIMEOUT_MS,             // For each connection attempt
        // see other options here: https://socket.io/docs/v4/client-options/
    });

    log(chalk.bold(`Connecting peer to: ${socket.io.uri}`));


    // register handlers with the peer socket
    const handlers = registerHandlers(socket);

    socket.on("connect_error", (err) => {
        log.error(chalk.bold.bgKeyword('red')(`${err.message}`));
    });

    socket.io.on("reconnect_failed", () => {
        console.log("max reconnects");
        socket.close();
        socket.io.uri = proxyReplica.next();      // advance to next backup
        console.log(`Swapping server urls to ${socket.io.uri}`)
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

    // socket.on('ad-replicate', 
    /**
     * @deprecated since adding passive https://github.com/bgunson/as/pull/35
     */
    //(name, ad) => {
 
    //     validAd = [];
    //     handlers.checkNumOfValidAd(validAd);
    //     if(validAd.length > 0){
    //         name = validAds[Math.floor(Math.random() * validAds.length)];
    //         var adPath = path.join(adDir, name);
    //         //sends back to proxy
    //         handlers.giveAd(adPath);
    //     }
    // });

    socket.connect();

    return handlers;
};
