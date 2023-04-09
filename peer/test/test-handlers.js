const { assert } = require("chai");
const registerHandlers = require("../src/handlers");
const fs = require('fs');
const path = require('path');

const { io } = require('socket.io-client');
const { adDir, validTypes } = require("../src/defaults");

describe('handlers', () => {

    let peer, handlers, testAd;

    before(() => {
        peer = io();
        handlers = registerHandlers(peer);
    });

    after(() => {
        peer.close();
    });

    it('uploadAd_SingleFakeAd', () => {
        testAd = handlers.uploadAd("fake.png", Buffer.from("data"));
        const ad = handlers.getAd();
        assert.equal(fs.existsSync(ad), true);
    });

    it('#checkNumOfValidAd should work', () => {
        let valid = [];
        handlers.checkNumOfValidAd(valid);
        assert.equal(valid.length, fs.readdirSync(adDir).filter(f => validTypes.includes(path.extname(f))).length);
    });

    it('getAd_SingleFakeAd_validAdPath', () => {
        const ad = handlers.getAd(testAd);
        assert.equal(fs.existsSync(ad), true);
    });

    it('updatePeerList_should_work', () => {
        const fakeList = ['x', 'y', 'z'];
        assert.equal(handlers.updatePeerList(fakeList), fakeList);
    });

    it('deleteAd_', () => {

    });
    
});