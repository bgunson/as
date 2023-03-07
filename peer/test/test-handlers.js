const { assert } = require("chai");
const registerHandlers = require("../src/handlers");
const fs = require('fs');
const path = require('path');

const { io } = require('socket.io-client');

const adDir = path.join(process.cwd(), '/ads'); // ad dir

describe('handlers', () => {

    let peer, handlers;

    before(() => {
        peer = io();
        handlers = registerHandlers(peer);
    });

    after(() => {
        peer.close();
    });

    it('#uploadAd() should work', () => {
        handlers.uploadAd("fake.png", Buffer.from("data"));
        const ad = handlers.getAd();
        assert.equal(fs.existsSync(ad), true);
    });

    it('#checkNumOfValidAd should work', () => {
        let valid = [];
        handlers.checkNumOfValidAd(valid);
        assert.equal(valid.length, fs.readdirSync(adDir).length);
    });

    it('#getAd() should return a valid ad path', () => {
        const ad = handlers.getAd("fake.png");
        assert.equal(fs.existsSync(ad), true);
    });

    it('#updatePeerList() should work', () => {
        const fakeList = ['x', 'y', 'z'];
        assert.equal(handlers.updatePeerList(fakeList), fakeList);
    });

    it('#deleteAd() should work', () => {

    });
    
});