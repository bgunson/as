/**
 * HTTP endpoints
 */

const express = require('express');
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

        const timeoutAd = new Promise((resolve) => {
            setTimeout(() => {
                resolve(() => res.sendFile(getDefaultAd()))
            }, 2000);   // 2 sec default
        });

        const peerAd = new Promise((resolve) => {
            peers.once('give-ad', (fName, stream) => {
                // test file name from peer
                const fType = isValidType(fName);
                
                // if fType is undefined (not valid image or asset) bad, else forward to client 
                if (!fType) {
                    resolve(() => res.sendFile(getDefaultAd()));  
                } else {
                    resolve(() => {
                        res.contentType(fName);
                        res.send(stream);
                    })
                } 
            });
        }); 

        // timeout or peer response wins
        Promise.race([timeoutAd, peerAd]).then(sendAd => sendAd());
    }
);

module.exports = router;