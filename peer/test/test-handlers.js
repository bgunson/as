const { assert } = require("chai");
const registerHandlers = require("../src/handlers");
const fs = require('fs');

const { io } = require('socket.io-client');

describe('handlers', () => {

    let peer, handlers;

    before(() => {
        peer = io();
        handlers = registerHandlers(peer);
    });

    after(() => {
        peer.close();
    });

    it('#getAd() should return a valid ad path', () => {
        const ad = handlers.getAd();
        assert.equal(fs.existsSync(ad), true);
    });

    it('#updatePeerList() should work', () => {
        const fakeList = ['x', 'y', 'z'];
        assert.equal(handlers.updatePeerList(fakeList), fakeList);
    });

    it('#uploadAd() should work', () => {

    });

    it('#deleteAd() should work', () => {

    });
    
});