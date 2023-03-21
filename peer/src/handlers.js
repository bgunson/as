const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const { Socket } = require('socket.io-client');
const chalk = require('chalk');
var log = require('fancy-log');
const { adDir } = require('./defaults');


/**
 * @param {Socket} peer - the peer socket.io-client instance
 * @returns api functions
 */
module.exports = (peer) => {

    let peers;

    /**
     * @param {string[]} list - list of lates peer ids (including our own) 
     */
    const updatePeerList = (list) => {
        peers = list;
        console.log(`Peer list update:`);
        console.log(peers);
        return peers;
    }

    /**
     * Choose an ad randomly from peer with the assumption that peer has an ad and emits back to proxy
     * @param {string} name - optional name (with ext) of exact ad file wanted
     * @returns well-formed path to the ad file on this peer, null if invalid ad
     */
    const getAd = (name) => {
        validAds = [];
        checkNumOfValidAd(validAds);
        if(validAds.length > 0){
            if (!name) {
                // Pick a random file up to number of files
                name = validAds[Math.floor(Math.random() * validAds.length)];
            }

            return path.join(adDir, name);

            // if no validAd, send request to proxy to ask ad from other peers 
        } else {
            console.log("No valid ads available, will wait for replication")
            // //sends id to indicate which peer is requesting ad
            // peer.emit("request-replicate");
            return null;
        }
        
    }

    /**
     * Emit ad bytes back to proxy
     * @param {string} ad 
     */
    const giveAd = (ad) => {
        fs.readFile(ad, (err, data) => {
            if (!err) {
                console.log("Transmitting ad: " + ad + " to proxy...");
                peer.emit("give-ad", path.basename(ad), data);
            } else {
                //NB: With nodemon running both proxy and server instances, error transmitting puts client page to perma-reloading with no ad rip
                //Fix^ and have to also get client to refresh and get proper ad 
                console.log("Error transmitting ad to proxy! Check ad config settings!");
            }
        });
    }

    /**
     * 
     * @param {string} name - name of file 
     * @param {Buffer} ad - data 
     * @returns - the name of the new ad (base64 digest of the hashed file using sha256)
     */
    const uploadAd = (name, ad) => {
        if (!fs.existsSync(adDir)) {
            fs.mkdirSync(adDir, { recursive: true });
        }

        // hash the incoming file (buffer) and use its base64 digest as the name when writing to disk
        const hashSum = crypto.createHash('sha256');
        hashSum.update(ad);
        const hashName = hashSum.digest('base64url') + path.extname(name);

        fs.writeFile(path.join(adDir, hashName), ad, (err) => {
            if (err) {
                console.log(err.message);
            }
        });

        return hashName;
        // TODO: maybe? peer.emit a general replication message (if upload was called via http api)
    }

    const deleteAd = () => {

    }

    /**
         * extracts file extension from a given file name
         * @param {string} filename The name of the file 
         * @returns file extension of the input file
         */
    const checkNumOfValidAd = (validAd) => {

        if (!fs.existsSync(adDir)) {
            return [];
        }

        //Access files in path
        const files = fs.readdirSync(adDir);

        //first check all files under ads folder to make sure there is no valid ad even if there are files
        for(let file of files){
            let extension = path.extname(file).toLowerCase();
            if(extension == '.png' || extension == '.jpeg' || extension == '.jpg'){
                validAd.push(file);
            }
        }

        return validAd;

    }

    return {
        getAd,
        giveAd,
        updatePeerList,
        uploadAd,
        deleteAd,
        checkNumOfValidAd 
    }

}

