const { Socket } = require("socket.io");
const Peers = require("./peers");

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
        io.emit("give-peer-list", peers.getPeerList());
    }

    /**
     * When a peer responds with an ad
     * @param {string} id - name or id of ad 
     * @param {Buffer} ad - ad bytes
     */
    const giveAd = (id, ad) => {
        peers.emit("give-ad", id, ad);
    }

    /**
     * When a peer disconnects
     */
    const onDisconnect = () => {
        console.log(`${socket.id} disconnected`);
        // this peer disconected, remove from local cache so they wont be picked next time a client hails an ad
        peers.removePeer(socket);   // remove self
        io.emit("give-peer-list", peers.getPeerList())
    }

    /**
     * This peer wants to replicate an ad
     * @param {unknown} ad ?
     */
    const requestReplicate = (socket) => {
        // TODO: potential implmentation
        console.log(`${socket.id} requesting ad from peers`);

        peers.exclude(socket.id).forEach((peer) => {
            peer.emit('ad-replicate');
        });

        peers.exclude(socket.id).forEach((peer) => {
            peer.once('give-ad', (name, ad) => {
                socket.emit('replicate-response', name,ad);
            });
        });
        
        // single ad implentation
        // peers.once('give-ad', (name,ad) => socket.emit('replicate-response', name,ad) )

        // then wait for feedback from otherPeer and emit back to this peer 'socket'

        // throw new Error("Not yet implemented.");
    }

    // register handlers w/ socket
    socket.on('request-replicate', () => requestReplicate(socket));
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

    