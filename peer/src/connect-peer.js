const { io } = require("socket.io-client");
const fs = require('fs');
const path = require('path');
const adDir = path.join(process.cwd(), '/ads'); 
const chalk = require('chalk');
var log = require('fancy-log');

require('dotenv').config();

const registerHandlers = require('./handlers');
// Read from env var file
const serverURL = process.env.SERVER_URL; 
const backup_serverURL1 = process.env.SERVER_URL_BACKUP_1;
const backup_serverURL2 = process.env.SERVER_URL_BACKUP_2;      // not handled for yet, TODO: better handling multiple proxies

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

    get addr() {
        return this._backups[this._index];
    }

    next() {
        let current = this._backups[this._index];
        this._index = ++this._index % this._backups.length;
        return current;
    }
}

/**
 * Utility function to set up socket.io-client for connecting to proxy
 * @returns socket.io-client instance
 */
module.exports = () => {

    const proxyReplica = new ProxyReplica();    

    const socket = io(proxyReplica.next(), {
        autoConnect: false,     // connect is called at bottom
        reconnectionAttempts: 2     // num attempts to connect to a given replica
        // see other options here: https://socket.io/docs/v4/client-options/
        
        // TODO: idk if you want to load the env var timeouts, etc but the defaults provided by socket.io-client are reasonable and they have
        // randomization implemented as well. 
    });

    console.log(`Connecting peer to ${socket.io.uri}`)


    // register handlers with the peer socket
    const handlers = registerHandlers(socket);

    socket.on("connect_error", (err) => {
        console.log(`ERROR connecting to proxy: ${err.message}`);
    });

    socket.io.on("reconnect_failed", () => {
        console.log("max reconnects");
        socket.close();
        socket.io.uri = proxyReplica.next();      // advance to next backup
        console.log(`Swapping server urls to ${proxyReplica.addr}`)
        socket.connect();
    });

    socket.on("connect", () => {
        console.log(`Proxy connection established...`);
        socket.emit("get-peer-list");
    });

    socket.on('replicate-response', (name, ad) => {
        handlers.uploadAd(name, ad)
    });

    socket.on('get-ad', (name) => {
        const ad = handlers.getAd(name);
        if (ad) {
            handlers.giveAd(ad);
        }
    });

    socket.on('give-peer-list', handlers.updatePeerList);


    socket.on('ad-replicate', (name, ad) => {
 
        validAd = [];
        handlers.checkNumOfValidAd(validAd);
        if(validAd.length > 0){
            name = validAds[Math.floor(Math.random() * validAds.length)];
            var adPath = path.join(adDir, name);
            //sends back to proxy
            handlers.giveAd(adPath);
        }

    });

    socket.connect();
    return handlers;

};
