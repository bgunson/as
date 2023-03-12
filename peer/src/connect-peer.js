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
const serverTimeout_ms = process.env.CONN_TIMEOUT || 7000; 

// Between each retry attempt connecting to same server; default 5 seconds
const retryInterval_ms = process.env.RETRY_INTERVAL_MS || 5000;

// Number of tries to retry attempt connection to a server; default 3 tries
const retryAttempts = process.env.NUM_RETRIES || 3;

// Flag for determining re-looping through all URLs in data structure infinitely; default true
const permaLoop = process.env.HEADLESS || false;

// Max number of retry cycles that the socket will try looping through all URLs trying to establish connection; default 2 cycles
const maxLoopCount = process.env.MAX_RETRY_LOOPS || 2;

//merge 29 w
class ProxyReplicaDS {

    /**
     * Circular Linked List for defined server URLs 
     */
    constructor() {
        // 0 based indexing
        this._index = 0; 
        this._backups = [backup_serverURL1, serverURL, backup_serverURL2].filter(b => b !== undefined);
        // keep track of how times a `cycle` has been completed wherein each URL has been exhausted
        this._numCycles = 0;
        this._maxCycles = permaLoop ? 1 : 99;         // Will keep indefinitely looping this many times
    };

    // Return current node element
    get addr() {
        return this._backups[this._index];
    };

    get cyclesSoFar(){
        return this._numCycles;
    };

    // Return next node element IFF it is under the maximum number of loopings
    get next() {
        let current = this._backups[this._index];
        // update index
        this._index = ++this._index % this._backups.length;
        
        if(this._index === 0 ){
            // Can only be 1st index if the previous URL was the (-1)th one
            this._numCycles++;
            if (this._numCycles >= this._maxCycles){
                // signal stop as max num of cycles have been reached at this point!
                return null;
            }
        };
        return current;
    };

    // Return true if all nodes have been visited atleast once i.e. one cycle has been complete
    get hasCompletedOneCycle() {
        return this._numCycles > 0;
    };
};

/**
 * Utility function to set up socket.io-client for connecting to proxy
 * @returns socket.io-client instance
 */
module.exports = () => {

    const proxyReplica = new ProxyReplicaDS();    

    const socket = io(proxyReplica.addr, {

        transports: ['websocket'],              // https://stackoverflow.com/a/69450518; WebSocket over HTTP long polling
        autoConnect: false,                     // connect is called at bottom
        reconnectionAttempts: retryAttempts,    // num attempts to connect to a given replica 
        reconnectionDelay: retryInterval_ms,    // minimum delay between each reconnect attempt
        timeout: serverTimeout_ms,              // timeout for each connection attempt
        // see other options here:              // https://socket.io/docs/v4/client-options/
    });

    log.info(chalk(`Connecting peer instance to proxy server at: `) + chalk.bold.bgCyanBright(` ${proxyReplica.addr} `));

    // register handlers with the peer socket
    const handlers = registerHandlers(socket);

    //https://socket.io/docs/v4/client-api/

    socket.on("connect_error", (err) => {
        log.error(chalk.bold.red(`${err.message}`));
        // Not sure how to use the queue here,
    });
    
    socket.io.on("reconnect_attempt", (attempt) => {
        const temp = retryAttempts - attempt;
        log.error(`Trying to reconnect to ${proxyReplica.addr} \t Attempt number: ${attempt}\t Attempts remaining: ${temp}`);
    });

    socket.io.on("reconnect_error", (err)=>{
        log.error(chalk.bgRedBright(`Failed`) + chalk.bold(` to reconnect to ${proxyReplica.addr}.`));
    })

    socket.io.on("reconnect_failed", () => {
        // Unable to re-connect within reconnectionAttempts
        log.info(`Exhausted all ${retryAttempts} reconnect attempts for ${proxyReplica.addr}.`);

        // Close the socket for this address
        socket.close();
    
            // change to next URL in line
            socket.io.url = proxyReplica.next;
            
            // proxyReplica.next returns null IFF the maximum number of cycles has been exceeded
            if(socket.io.url === null){
                log.info(`Exhausted all ${maxLoopCount} cycles trying to connect to all proxy URLs!`);
            }else{
                log.info(`Swapping server URL to: ${proxyReplica.addr}`);
                socket.connect();
            };
            if(permaLoop){
                log.warn(`Will only loop once!`);
            }
            log.warn(`Cycles completed so far: ${proxyReplica.cyclesSoFar}`);
    });

    socket.on("connect", () => {
        log.info(chalk.bold(`Proxy connection established with :`) + chalk.bold.bgGreenBright(`${socket.io.uri}`));
        log.info(chalk(`This instance's peer ID is: `) + chalk.bold.bgBlueBright(`${socket.id} `));
        socket.emit("get-peer-list");
    });

    socket.on("disconnect", (reason)=> {
        log.warn(`Disconnected from ${socket.io.uri} !`);
        log.error(chalk.bold(reason));
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
