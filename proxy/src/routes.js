/**
 * HTTP endpoints
 */

const express = require('express');
const router = express.Router();

const { getDefaultAd } = require('./defaults');
const { isValidType } = require('./validators');

router.use('/version', 
    /**
     * @param {express.Request} req - GET /version 
     * @param {express.Response} res  Response: version from package.json
     */
    (req, res) => {
        const { version } = require('../package.json');
        res.send(version);
    }
);

router.use('/peers', 
    /**
     * @param {express.Request} req - GET /peers
     * @param {express.Response} res - Response: give the peer list of ids
     */
    (req, res) => {
        const peerList = req.app.get('peers').getPeerList();
        res.send(peerList);
    }
);

router.use('/ad', 
    /**
     * @param {express.Request} req - GET /ad
     * @param {express.Response} res - Response: a file containing advertisment
     */
    (req, res) => {
        // get the peers
        const peers = req.app.get('peers');
        // choose a peer
        const socket = peers.choosePeer();

        if (!socket) {
            // no servers online
            console.log("ERROR: No peers online! Serving default ad!");
            res.sendFile(getDefaultAd());
        } else {
            socket.emit("get-ad");  // tell them we want an ad
            
            // wait for the stream
            socket.once("give-ad", (fName, stream) => {

                // test file name from peer
                const fType = isValidType(fName);
                
                // if fType is undefined (not valid image or asset) bad, else forward to client 
                if (!fType) {
                    // fallabck here or re-request
                    res.sendFile(getDefaultAd());  
                } else {
                    res.contentType(fName);
                    res.send(stream);
                }    
            });
            
            setTimeout(() => {
                res.sendFile(getDefaultAd());
            }, 2000);
        }
    }
);

module.exports = router;