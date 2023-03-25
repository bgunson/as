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
     * Receive list of peers in swarm from the proxy server and display the list to console
     * @param {string[]} list - list of lates peer ids (including our own) 
     * @returns list of peers currently connected to proxy server's swarm
     */
    const updatePeerList = (list) => {
        peers = list;
        log.info(`\tUpdated list of peers in swarm currently:`);
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
            log.info("No valid ads available, will wait for replication")
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
                log.info("Transmitting ad: " + ad + " to proxy server!");
                peer.emit("give-ad", path.basename(ad), data);
            } else {
                log.error("Error transmitting ad to proxy! Check ad config settings!");
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

        //If ad containing directory, name defined earlier, does not exist in system, create it.
        if (!fs.existsSync(adDir)) {
            fs.mkdirSync(adDir, { recursive: true });
        };

        // Hash the incoming file (buffer) and use its base64 digest as the name when writing to disk
        const hashSum = crypto.createHash('sha256');
        hashSum.update(ad);
        const hashName = hashSum.digest('base64url') + path.extname(name);

        fs.writeFile(path.join(adDir, hashName), ad, (err) => {
            if (err) {
                log.error(chalk.bold(err.message));
            };
        });
        // peer.emit a general replication message (if upload was called via http api) to other peers
        // Issue#26 (reuse giveAd logic for replicationg)
        peer.emit('give-ad', name, ad);
        return hashName;
    }


    /**
     * Delete specified ad 
     * @param {string} name - name of file 
     * 
     */
    const deleteAd = (name) => {
        //#26
        
        fs.unlink(adDir + name, (err) => {
            if (err) {
                log.error(err);
            }
            log.info(`Deleted: ${name}`);
        });
        //Inform others
        peer.emit('delete-ad-replica', name);

    }

    /**
     * extracts file extension from a given file name
     * @param {string} filename The name of the file 
     * @returns file extension of the input file
     * */
    const checkNumOfValidAd = (validAd) => {

        if (!fs.existsSync(adDir)) {
            return [];
        }

        //Access files in path
        const files = fs.readdirSync(adDir);
        const validFileExts = ['.png','.jpeg','.jpg'];

        //first check all files under ads folder to make sure there is no valid ad even if there are files
        for(let file of files){
            let extension = path.extname(file).toLowerCase();
            if(validFileExts.includes(extension)){
                //Valid file extension detected
                validAd.push(file);
            }
            else{
                log.error(chalk.bgKeyword('red')('Invalid file extension! Not supported!'));
            }
        }

        return validAd;

    }

    const returnAdList = () => {
        allAds = [];

        allAds = fs.readdirSync(adDir);
        
        return allAds;

    }

    return {
        getAd,
        giveAd,
        updatePeerList,
        uploadAd,
        deleteAd,
        checkNumOfValidAd,
        returnAdList
    }

}

