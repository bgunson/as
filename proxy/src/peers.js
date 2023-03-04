/**
 * Object to store current peers
 */

const { Socket } = require("socket.io");
const EventEmitter = require('events');

class Peers extends EventEmitter {

    constructor() {
        super();
        this._peers = {};
    }

    /**
     * Get the current peer list
     * @returns an object of socket ids and socket references
     */
    getPeerList() {
        return Object.keys(this._peers);
    }

    /**
     * Get a (random for now) peer. Note this could return the id of the same peer who triggers the event.
     * @returns A socket reference to the peer
     */
    choosePeer() {
        // choose random peer
        const peerId = Object.keys(this._peers)[Math.floor(Math.random() * Object.keys(this._peers).length)];

        // get the socket ref of the chosen server
        return this._peers[peerId];
    }

    /**
     * Add a peer to the peer list
     * @param {Socket} peer 
     */
    addPeer(peer) {
        this._peers[peer.id] = peer;
    }

    /**
     * Remove a peer form the peer list
     * @param {Socket} peer 
     */
    removePeer(peer) {
        delete this._peers[peer.id];
    }

}

module.exports = Peers;