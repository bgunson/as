/**
 * HTTP endpoints
 */

const express = require('express');
const router = express.Router();

const { getDefaultAd } = require('./defaults');
const { isValidType } = require('./validators');

/**
 * GET /ad
 */
router.use('/ad', (req, res) => {

    // get the peers
    const peers = req.app.get('peers');
    // choose a peer
    const socket = peers.choosePeer();

    if (!socket) {
        // no servers online
        console.log("ERROR: No peers online! Serving default ad!");
        res.sendFile(getDefaultAd());
        return;
    }
    
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

});

module.exports = router;