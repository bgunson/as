const { io } = require("socket.io-client");
const fs = require('fs');
const path = require('path');

const registerHandlers = require('./handlers');

const port = process.env.PORT || 3000;
const serverURL = process.env.NODE_ENV === 'production' ? `https://5b9a-68-147-173-125.ngrok.io/` : `http://localhost:${port}`; // default to dev 

/**
 * Utility function to set up socket.io-client for connecting to proxy
 * @returns socket.io-client instance
 */
module.exports = () => {

    let peers;  // other peers
    
    if (process.env.NODE_ENV === 'production'){
        console.log(`Peer running in prod. mode connecting to ${serverURL}`);
    } else {
        console.log(`Peer running in dev. mode connecting to ${serverURL}`);
    }

    const socket = io(serverURL);

    // register handlers with the peer socket
    const handlers = registerHandlers(socket);

    socket.on("error", (err) => console.log(err));

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

    return handlers;

}
