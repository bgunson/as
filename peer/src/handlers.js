const path = require('path');
const fs = require('fs');
const { Socket } = require('socket.io-client');

const adDir = path.join(process.cwd(), '/ads'); // ad dir

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
     * @returns well-formed path to the ad file on this peer, false if invalid ad
     */
    const getAd = (name) => {
        validAds = [];
        checkNumOfValidAd(validAds);
        if(validAds.length > 0){
            if (!name) {
                // Pick a random file up to number of files
                name = validAds[Math.floor(Math.random() * validAds.length)];
            }

            var adPath = path.join(adDir, name);

            // if no validAd, send request to proxy to ask ad from other peers 
        }else{
            console.log("No valid ads available, will need to replicate")
            //sends id to indicate which peer is requesting ad
            peer.emit("request-replicate", peer.id);
        }

        return adPath;
        
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
     */
    const uploadAd = (name, ad) => {
        if (!fs.existsSync(adDir)) {
            fs.mkdirSync(adDir, { recursive: true });
        }
        fs.writeFileSync(path.join(adDir, name), ad);

        // peer.emit a general replication message (if upload was called via http api)
    }

    const deleteAd = () => {

    }

    const checkNumOfValidAd = (validAd) => {
        /**
         * extracts file extension from a given file name
         * @param {string} filename The name of the file 
         * @returns file extension of the input file
         */
        const getFileExt = (filename) => {
            return filename.substring(filename.lastIndexOf('.')+1, filename.length) || filename;
        }

        if (!fs.existsSync(adDir)) {
            return [];
        }

        //Access files in path
        const files = fs.readdirSync(adDir);

        //first check all files under ads folder to make sure there is no valid ad even if there are files
        for(let file of files){
            if(getFileExt(file) == 'png' || getFileExt(file) == 'jpeg' || getFileExt(file) == 'jpg'){
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

