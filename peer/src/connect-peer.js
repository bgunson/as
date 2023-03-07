const { io } = require("socket.io-client");
const fs = require('fs');
const path = require('path');

const registerHandlers = require('./handlers');

const port = process.env.PORT || 3000;
const serverURL = process.env.SERVER_URL || `http://localhost:${port}`; // default to dev i.e. localhost 
const adDir = path.join(process.cwd(), '/ads'); 


/**
 * Utility function to set up socket.io-client for connecting to proxy
 * @returns socket.io-client instance
 */
module.exports = () => {

    let peers;  // other peers
    
    if (process.env.NODE_ENV === 'production'){
        console.log(`Peer running in prod. mode.\tConnecting to: ${serverURL}`);
    } else {
        console.log(`Peer running in dev. mode.\tConnecting to: ${serverURL}`);
    }

    const socket = io(serverURL);

    // register handlers with the peer socket
    const handlers = registerHandlers(socket);

    socket.on("error", (err) => console.log(err));

    socket.on("connect", () => {
        console.log(`Proxy connection established.`);
        console.log(`Instance peer ID is: ${socket.id}\n`);
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
