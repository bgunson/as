const path = require('path');
const fs = require('fs');
const { Socket } = require('socket.io-client');

const adDir = path.join(process.cwd(), '/ads'); // ad dir

/**
 * 
 * @param {Socket} io the proxy socket
 * @param {Socket} peer - the peer socket.io-client instance
 * @returns api functions
 */
module.exports = (peer, io) => {

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
     * @returns well-formed path to the ad file on this peer, false if invalid ad
     */
    const getAd = (name) => {

        /**
         * extracts file extension from a given file name
         * @param {string} filename The name of the file 
         * @returns file extension of the input file
         */
        const getFileExt = (filename) => {
            return filename.substring(filename.lastIndexOf('.')+1, filename.length) || filename;
        }

        //Access files in path
        const files = fs.readdirSync(adDir);

        validAds = []
        //first check all files under ads folder to make sure there is no valid ad even if there are files
        for(let file of files){
            if(getFileExt(file) == 'png' || getFileExt(file) == 'jpeg' || getFileExt(file) == 'jpg'){
                validAds.push(file);
            }
        }

        // if no validAd, send request to proxy to ask ad from other peers 
        if(validAds.length == 0){
            console.log("No valid ads available, will need to replicate")
            //sends id to indicate which peer is requesting ad
            io.emit("request-replicate", peer.id)
        }


        if (!name) {
            // Pick a random file up to number of files
            name = validAds[Math.floor(Math.random() * validAds.length)];
        }

        const adPath = path.join(adDir, name);

        return adPath;
        
    }

    const uploadAd = () => {
        // maybe:  
        // peer.emit("replicate", newAd);
    }

    const deleteAd = () => {

    }

    return {
        getAd,
        updatePeerList,
        uploadAd,
        deleteAd
    }

}

