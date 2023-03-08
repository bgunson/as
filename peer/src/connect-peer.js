const { io } = require("socket.io-client");
const fs = require('fs');
const path = require('path');
const adDir = path.join(process.cwd(), '/ads'); 
const chalk = require('chalk');
var log = require('fancy-log');

require('dotenv').config();

const registerHandlers = require('./handlers');
// Read from env var file
const port = process.env.SERVER_PORT || 3000;
const serverURL = process.env.SERVER_URL; 
const backup_serverURL1 = process.env.SERVER_URL_BACKUP_1;
const backup_serverURL2 = process.env.SERVER_URL_BACKUP_2;
const SERVER_TIMEOUT_MS = 5000;
const SERVER_TIMEOUT = SERVER_TIMEOUT_MS/1000; 


/**
 * Utility function to set up socket.io-client for connecting to proxy
 * @returns socket.io-client instance
 */
module.exports = () => {

    let peers;  // other peers
    
    if (process.env.NODE_ENV === 'production'){
        log.info(chalk(`Peer running in prod. mode.`));
    } else {
        log.info(chalk(`Peer running in dev. mode.\tConnecting to:`) + chalk.bold.bgGreenBright(` ${serverURL} `));
    }

    // const socket = io(serverURL);
    let socket;

    //NB: Try-Catch method doesnt work (tries forever to connect to first url...); better error handling with Promises instead
    // Promise. Resolves iff socket successfully connects within SERVER_TIMEOUT seconds!
    const connectPromise = new Promise((resolve, reject) => {
        // 1st - Attempt to connect to remote proxy server using the primary URL
        log.info(chalk(`\t Trying to connect to primary proxy: `) + chalk.bold.bgYellowBright(` ${serverURL} `));
        socket = io(serverURL);
        socket.on('connect', () => {
            // Notify that WebSocket connection successful.
            log.info(chalk.bold(`Proxy connection established. Joined: `) + chalk.bold.bgGreenBright(`${serverURL}'s swarm!`));
            log.info(`Instance peer ID is: ` + chalk.bgMagentaBright.bold(`${socket.id}\n`));
            socket.emit("get-peer-list");
            resolve(socket);
        });

        // 2nd - Attempt to connect to backup proxy server URL if 1st/primary URL fails 
        const backupSocket = io(backup_serverURL1);
        backupSocket.on('connect', () => {
            // Notify that WebSocket connection successful.
            log.info(chalk.bold(`Proxy connection established. Joined: `) + chalk.bold.bgGreenBright(`${backup_serverURL1}'s swarm!`));
            log.info(`Instance peer ID is: ` + chalk.bgMagentaBright.bold(`${backupSocket.id}\n`));
            backupSocket.emit("get-peer-list");
            resolve(backupSocket);
        });

        // Reject this promise if *ALL* connection attempts fail!
        socket.on('connect_failed', (err) => {
            log.info(chalk.bold.red(`Failed to connect to ${serverURL} , trying backup server: ${backup_serverURL1}`));
            log.error(chalk.bold(err));
            // initiate connection attempt again this time to the backup server
            backupSocket.open(); 
        });
        backupSocket.on('connect_failed', (err) => {
            log.info(chalk.bold.red(`Failed to backup server: ${backup_serverURL1}`));
            reject(new Error(`Failed to connect to both ${serverURL} and ${backup_serverURL1}...`));
        });
    });

    // Promise that resolves after some predefined seconds; SERVER_TIMEOUT (i.e. stop trying to connect to a proxy after 5 seconds)
    const timeoutPromise = new Promise((resolve, reject) => {
        setTimeout(() => {
            reject(new Error(`Timeout! Unable to connect to ${serverURL} in ${SERVER_TIMEOUT} seconds...`));
        }, SERVER_TIMEOUT_MS);
    });

    // Race between the connectPromise and the timeoutPromise
    Promise.race([connectPromise, timeoutPromise]).then( (socket) => {
        // Peer-Proxy socket connection successfull..
        // register handlers with the peer socket
        const handlers = registerHandlers(socket);

        socket.on("error", (err) => console.log(err));

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
        log.error(chalk.bold(`Unable to reach proxy servers! Please ensure that the server URLs are correct and that the servers themselves are available!`));
        log.error(chalk.bold.bgRedBright(error));
    })};
/*
    // register handlers with the peer socket
    const handlers = registerHandlers(socket);

    socket.on("error", (err) => console.log(err));

    // socket.on("connect", () => {
    //     // Notify that WebSocket connection successful.
    //     log.info(chalk.bgGreenBright(`Proxy connection established.`));
    //     log.info(`Instance peer ID is: ` + chalk.bgMagentaBright.bold(`${socket.id}\n`));
    //     socket.emit("get-peer-list");
    // });
    

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

}
*/