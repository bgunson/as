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

/**
 * Utility function to set up socket.io-client for connecting to proxy
 * @returns socket.io-client instance
 */
module.exports = () => {

    let peers;  // other peers
    
    if (process.env.NODE_ENV === 'production'){
        log.info(chalk(`Peer running in prod. mode.`));
    } else {
        log.info(chalk(`Peer running in dev. mode.`));
    };

    // const socket = io(serverURL);
    let socket;

    //NB: Try-Catch method doesnt work (tries forever to connect to first url...); better error handling with Promises instead
    // Promise. Resolves iff socket successfully connects to proxy server after retrying a bunch of times if it fails
    const connectPromise = new Promise((resolve, reject) => {
        // Utility function to retry connecting to a proxy server URL
        function connectToServer(serverURL, retryCount) {
            
            log.info(chalk(`\t Trying to connect to proxy server at: `) + chalk.bold.bgYellowBright(` ${serverURL} `));
            
            socket = io(serverURL);
            
            socket.on('connect', () => {
                // Notify that WebSocket connection successful!
                log.info(chalk.bold(`Proxy connection established. Joined: `) + chalk.bold.bgGreenBright(`${serverURL}'s swarm!`));
                log.info(`Instance peer ID is: ` + chalk.bgMagentaBright.bold(`${socket.id}\n`));
                socket.emit("get-peer-list");
                resolve(socket);
            });

            // If you fail the first time...
            socket.on('connect_error', (err) => {
                if (retryCount > 0) {
                    // Anotha one
                    log.info(chalk.bold.red(`Failed to connect to ${serverURL} ! Retrying. Attempts remaining: ${retryCount} !`));
                    setTimeout(() => {
                        // lil bit of recursion
                        connectToServer(serverURL, retryCount--);
                    }, RETRY_INTERVAL_MS);
                } else {
                    //retryCount <=0; retry limit reached!
                    log.error(chalk.bold.red(`Failed to connect to ${serverURL} ! All attempts exhausted. Trying for a backup proxy!`));
                    reject(new Error(`Failed to connect to ${serverURL} after ${retryCount} attempts !`));
                }
            });
        };

        // 1st - Attempt to connect to remote proxy server using the primary URL, upto a max of NUM_RETRIES times
        connectToServer(serverURL, NUM_RETRIES);

        // 2nd - Attempt to connect to backup proxy server URL if 1st/primary URL fails 
        socket.on('connect_error', (err) => {
            
            log.info(chalk.bold.red(`Failed to connect to ${serverURL}. Trying backup server: ${backup_serverURL1}`));
            log.error(chalk.bold(err));
            // initiate connection attempt again this time to the backup server, upto a max of NUM_RETRIES times
            connectToServer(backup_serverURL1, NUM_RETRIES);
        });

    });

    // Promise that `resolves` after SERVER_TIMEOUT_MS seconds trying to allow peer-proxy connection established, give up after that
    const timeoutPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error(`Timeout! Unable to connect to proxy server in ${SERVER_TIMEOUT} seconds.`));
        }, SERVER_TIMEOUT_MS);

    });

    // Race between the connectPromise and the timeoutPromise, who will win?
    Promise.race([connectPromise, timeoutPromise]).then( (socket) => {
        // Peer-Proxy socket connection successfull..
        // register handlers with the peer socket
        const handlers = registerHandlers(socket);

        socket.on("error", (err) => console.log(err));

        socket.on("disconnect", ()=>log.info("Disconnected!"));

        socket.on('replicate-response', (name, ad) => {
            handlers.uploadAd(name, ad);
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

        return handlers;
    })
    .catch((error) => {
        // Connection was unsuccessful to ALL proxy urls.... what to todo here....
        log.error(chalk.bold.bgRedBright(error));
    });

};
