/**
 * HTTP endpoints
 */

const express = require('express');
const { writeLog } = require('./activity-logger');
const router = express.Router();

const { getDefaultAd } = require('./defaults');
const { isValidType } = require('./validators');


router.get('/version', 
    /**
     * @param {express.Request} req - GET /version 
     * @param {express.Response} res  Response: version from package.json
     */
    (req, res) => {
        const { version } = require('../package.json');
        res.send(version);
    }
);

router.get('/peers', 
    /**
     * @param {express.Request} req - GET /peers
     * @param {express.Response} res - Response: give the peer list of ids
     */
    (req, res) => {
        const peerList = req.app.get('peers').getPeerList();
        res.send(peerList);
    }
);

router.get('/ad', 
    /**
     * @param {express.Request} req - GET /ad
     * @param {express.Response} res - Response: a file containing advertisment
     */
    (req, res) => {

        const io = req.app.get('io');   // main socketio server instance
        
        const peers = req.app.get('peers'); // the peers

        // ask all peers for an ad
        io.emit('get-ad');

        const timeoutAd = new Promise((resolve, reject) => {
            setTimeout(reject, 2000);
        });

        const peerAd = new Promise((resolve, reject) => {
            peers.once('give-ad', (peer, fName, stream) => {
                // test file name from peer
                const fType = isValidType(fName);
                
                // if fType is undefined (not valid image or asset) bad, else forward to client 
                if (!fType) {
                    reject();  
                } else {

                    const message = `${Date.now()} peer @ ${peer.handshake.address} served '${fName}'\n`;
                    writeLog(message);
                    io.emit('activity-log-msg', message);

                    resolve(() => {
                        res.contentType(fName);
                        res.send(stream);
                    });
                } 
            });
        }); 

        // timeout or peer response wins
        Promise.race([timeoutAd, peerAd])
            .then(sendAd => sendAd())
            .catch(() => res.sendFile(getDefaultAd()));
    }
);

module.exports = router;