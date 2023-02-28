const { assert } = require("chai");
const { Socket } = require("socket.io");
const Peers = require('../src/peers');

describe('peers', () => {
    const peers = new Peers();
    const mockPeer = { id: 'test' }

    it('should return an initial peer list (empty)', () => {
        const list = peers.getPeerList();
        assert.deepEqual(list, []);
    });

    it('should add a peer', () => {
        peers.addPeer(mockPeer);
        assert.equal(peers.getPeerList().length, 1);
    });

    it('should choose a peer', () => {
        let p = peers.choosePeer();
        assert.deepEqual(p, mockPeer);
    });

    it('should remove the peer', () => {
        peers.removePeer(mockPeer);
        assert.equal(peers.getPeerList().length, 0);
    })
    
});