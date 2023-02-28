const { Socket } = require("socket.io");

/**
 * 
 * @param {Socket} socket a server socket reference to the calling peer
 * @param {Function} next 
 */
const peerHandlers = (socket, io, peers, next) => {

    /**
     * This peer wants to replicate
     */
    socket.on("replicate", (ad) => {
        // TODO: choose another peer to be replicated to
    });

    /**
     * This peer wants the current peer list
     */
    socket.on("get-peer-list", () => {
        // emit back to this peer with the peer list
        io.emit("give-peer-list", peers.getPeerList());
    });

    /**
     * This peer went offline
     */
    socket.on("disconnect", () => {
        console.log(`${socket.id} disconnected`);
        // this peer disconected, remove from local cache so they wont be picked next time a client hails an ad
        peers.removePeer(socket);   // remove self
        io.emit("give-peer-list", peers.getPeerList())
    });

    // ... add more to this scope

    next();

}


module.exports = peerHandlers;