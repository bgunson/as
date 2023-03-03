const path = require('path');
const fs = require('fs');
const { Socket } = require('socket.io-client');

const adDir = path.join(process.cwd(), 'ads'); // ad dir

/**
 * 
 * @param {Socket} peer - the peer socke.io-client instance
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
     * @returns well-formed path to the ad file on this peer, false if invalid ad
     */
    const getAd = (name) => {
        //Access files in path
        const files = fs.readdirSync(adDir);

        if (!name) {
            // Pick a random file up to number of files
            name = files[Math.floor(Math.random() * files.length)];
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

