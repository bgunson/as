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
    const replicate = (ad) => {
        // TODO: potential implmentation

        // const otherPeer = peers.choosePeer();
        // otherPeer.emit('replicate', ad);      // peers need to be waiting for this event

        // then wait for feedback from otherPeer and emit back to this peer 'socket'

        // throw new Error("Not yet implemented.");
    }

    // register handlers w/ socket
    socket.on('replicate', replicate);
    socket.on('get-peer-list', getPeerList);
    socket.on('disconnect', onDisconnect);

    // return functions so we can test
    return {
        getPeerList,
        replicate,
        onDisconnect
    };
}

    