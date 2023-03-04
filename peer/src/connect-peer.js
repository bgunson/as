const { io } = require("socket.io-client");
const fs = require('fs');
const path = require('path');

const registerHandlers = require('./handlers');

const port = process.env.PORT || 3000;
const serverURL = process.env.NODE_ENV === 'production' ? `https://14d8-68-147-173-125.ngrok.io/` : `http://localhost:${port}`; // default to dev 

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
        console.log("asdasd");
        handlers.uploadAd(name, ad)});

    socket.on('get-ad', (name) => {
        const ad = handlers.getAd(name);
        fs.readFile(ad, (err, data) => {
            if (!err) {
                console.log("Transmitting ad: " + ad + " to proxy...");
                socket.emit("give-ad", path.basename(ad), data);
            } else {
                //NB: With nodemon running both proxy and server instances, error transmitting puts client page to perma-reloading with no ad rip
                //Fix^ and have to also get client to refresh and get proper ad 
                console.log("Error transmitting ad to proxy! Check ad config settings!");
            }
        });
    });

    socket.on('give-peer-list', handlers.updatePeerList);

    return handlers;

}
