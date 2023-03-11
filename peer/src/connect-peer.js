const { io } = require("socket.io-client");
const fs = require('fs');
const path = require('path');
const adDir = path.join(process.cwd(), '/ads'); 
const chalk = require('chalk');
var log = require('fancy-log');

require('dotenv').config();

const registerHandlers = require('./handlers');
const { TIMEOUT } = require("dns");
// Read from env var file
const serverURL = process.env.SERVER_URL; 
const backup_serverURL1 = process.env.SERVER_URL_BACKUP_1;
const backup_serverURL2 = process.env.SERVER_URL_BACKUP_2;      

// Max time to wait for connection to be established with proxy server; default 7 seconds
const SERVER_TIMEOUT_MS = process.env.CONN_TIMEOUT || 7000;
const SERVER_TIMEOUT = SERVER_TIMEOUT_MS/1000; 

// Between each retry attempt connecting to same server; default 5 seconds
const RETRY_INTERVAL_MS = process.env.RETRY_INTERVAL_MS || 5000;
const RETRY_TIMEOUT = RETRY_INTERVAL_MS/1000;
// Number of tries to retry attempt connection to a server; default 3 tries
const NUM_RETRIES = process.env.NUM_RETRIES || 3;

//merge 29 w
class ProxyReplicaQueue {

    /**
     * Queue for defined server URLs 
     */
    constructor() {
        // Initialize
        this._queue = [serverURL, backup_serverURL1, backup_serverURL2].filter(b => b !== undefined);
      }
    
      enqueue(url) {
        // Add url to queue (NOT USED!)
        this._queue.push(url);
      }
    
      dequeue() {
        // Pop goes the weasel
        return this._queue.shift();
      }
    
      get size() {
        return this._queue.length;
      }
    
      // FiFo
      get next() {
        return this._queue[0];
      }
    
      // Need this to prevent perma looping 
      get isEmpty() {
        return this._queue.length === 0;
      }

}

/**
 * Utility function to set up socket.io-client for connecting to proxy
 * @returns socket.io-client instance
 */
module.exports = () => {

    const proxyReplica = new ProxyReplicaQueue();    

    const socket = io(proxyReplica.next, {

        transports: ['websocket'],              //https://stackoverflow.com/a/69450518; WebSocket over HTTP long polling
        autoConnect: false,                     // connect is called at bottom
        reconnectionAttempts: NUM_RETRIES,      // num attempts to connect to a given replica (NUM_RETRIES)
        reconnectionDelay: RETRY_INTERVAL_MS,   // delay between each reconnect attempt
        timeout: SERVER_TIMEOUT_MS,             // For each connection attempt
        // see other options here: https://socket.io/docs/v4/client-options/

    });

    log.info(chalk(`Connecting peer instance to proxy server at: `) + chalk.bold.bgCyanBright(` ${socket.io.uri} `));

    // register handlers with the peer socket
    const handlers = registerHandlers(socket);

    //https://socket.io/docs/v4/client-api/

    socket.on("connect_error", (err) => {
        log.error(chalk.bold.red(`${err.message}`));
        // Not sure how to use the queue here,
    });
    
    socket.io.on("reconnect_attempt", (attempt) => {
        log.error(`Failed to reconnect to ${socket.io.uri} , this was the ${attempt} / ${NUM_RETRIES} reconnect try!`);
      });

    socket.io.on("reconnect_failed", () => {
        // Unable to re-connect within reconnectionAttempts
        log.info(`Exhausted all ${NUM_RETRIES} reconnect attempts for ${socket.io.uri} !`);
        proxyReplica.dequeue();
        // Close the socket for this address
        socket.close();
        // if queue is NOT empty, try next backup URL else... exit?
        if (!proxyReplica.isEmpty){
            socket.io.uri = proxyReplica.next;      // advance to next backup
            log.info(chalk(`Not all hope is lost!\nTrying to reach backup proxy server at : `) + chalk.bold.bgYellowBright(`${socket.io.uri}`));
            socket.connect();
        }else{
            // queue is empty = all server URLs have been tried atleast once, if want to keep it perma looping remove this if-else construct 
            log.info(`Tried all backup URLs!`);
        };
    });

    socket.on("connect", () => {
        log.info(chalk.bold.bgGreenBright(`Proxy connection established!`));
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
