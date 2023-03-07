const { io } = require("socket.io-client");
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
var log = require('fancy-log');

const registerHandlers = require('./handlers');

const port = process.env.SERVER_PORT || 3000;
const serverURL = process.env.SERVER_URL || `http://localhost:${port}`; // default to dev i.e. localhost 
const adDir = path.join(process.cwd(), '/ads'); 


/**
 * Utility function to set up socket.io-client for connecting to proxy
 * @returns socket.io-client instance
 */
module.exports = () => {

    let peers;  // other peers
    
    if (process.env.NODE_ENV === 'production'){
        log.info(chalk(`Peer running in prod. mode.\tConnecting to:`) + chalk.bold.bgYellowBright(` ${serverURL} `));
    } else {
        log.info(chalk(`Peer running in dev. mode.\tConnecting to:`) + chalk.bold.bgGreenBright(` ${serverURL} `));
    }

    const socket = io(serverURL);

    // register handlers with the peer socket
    const handlers = registerHandlers(socket);

    socket.on("error", (err) => console.log(err));

    socket.on("connect", () => {
        log.info(chalk.bgGreenBright(`Proxy connection established.`));
        log.info(`Instance peer ID is: ` + chalk.bgMagentaBright.bold(`${socket.id}\n`));
        socket.emit("get-peer-list");
    });

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
