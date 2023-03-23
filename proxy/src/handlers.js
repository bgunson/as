const { Socket } = require("socket.io");
const Peers = require("./peers");

const fs = require('fs');
let wstream = fs.createWriteStream("../Logs/activityLog.txt");

/**
 * socket.io event handlers
 * @param {Socket} io the main server socket
 * @param {Socket} socket the peer
 * @param {Peers} peers the currently connected peers
 */
module.exports = (io, socket, peers) => {

    console.log(`${socket.id} connected`);
    peers.addPeer(socket);

    /**
     * When a peer asks for the peer list
     */
    const getPeerList = () => {
        // emitting back to all peers when one requests
        const peerListStr = peers.getPeerList();
        io.emit("give-peer-list", peerListStr);

        //write log
        const message = `${getTimeStamp()} Peer list update: ${peerListStr}`
        writeLog(message);

    }

    /**
     * When a peer responds with an ad
     * @param {string} id - name or id of ad 
     * @param {Buffer} ad - ad bytes
     */
    const giveAd = (id, ad) => {
        peers.emit("give-ad", id, ad);

        //write log
        const message = `${getTimeStamp()}, ${peer.id} served ${ad}`;
        writeLog(message)

        // when an ad is incoming to the proxy ask all others if they need it to be replicated
        peers.exclude(socket.id).forEach((peer) => {
            peer.emit('want-ad', id, (ans) => {
                if (ans === true) {
                    console.log(`Peer: ${peer.id} needs ad '${id}'`);
                    peer.emit('replicate', id, ad);

                    message = `${getTimeStamp()}, replicating ad for ${peer.id}, ${ad} given`;
                    writeLog(message);
                }
            });
        });
    }

    /**
     * When a peer disconnects
     */
    const onDisconnect = () => {
        console.log(`${socket.id} disconnected`);
        // this peer disconected, remove from local cache so they wont be picked next time a client hails an ad
        peers.removePeer(socket);   // remove self
        const peerListStr = peers.getPeerList();
        io.emit("give-peer-list", peerListStr);
        
        //write in log
        const message = `${getTimeStamp()} Peer list update: ${peerListStr}`
        writeLog(message);
    }

    /**
     * @deprecated since passsive replication inside giveAd handler
     * This peer wants to replicate an ad
     * @param {unknown} ad ?
     */
    const requestReplicate = () => {
        console.log(`${socket.id} requesting ad from peers`);
        // ask all other peers for an ad
        socket.broadcast.emit('ad-replicate');    
    }

    const getTimeStamp = () => {
        const currentDate = new Date();
        const timestamp = currentDate.getTime();
        return timestamp;
    }

    const writeLog = (data) => {
        wstream.write(data, (err) =>{
            if(err){
                console.log(err.message);
            }
        })
    }

    // register handlers w/ socket
    // socket.on('request-replicate', requestReplicate);   
    socket.on('get-peer-list', getPeerList);
    socket.on('disconnect', onDisconnect);
    socket.on('give-ad', giveAd);
   
    // return functions so we can test
    return {
        requestReplicate,
        getPeerList,
        onDisconnect,
        giveAd
    };
}

    