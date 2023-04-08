const { assert } = require("chai");
const fs = require('fs');
const AdList = require('../src/adlist');
const { join } = require("path");
const { adDir } = require("../src/defaults");

describe('adlist', () => {

    const testList = new AdList('whitelist');

    it('should be initially empty', () => {
        assert.deepEqual(testList.list, []);
    });

    it('should be add to list', () => {
        testList.add('test');
        assert.isTrue(testList.list.includes('test'));
    });

    it('should be removed from list', () => {
        testList.remove('test');
        assert.isFalse(testList.list.includes('test'));
    });

    it('should be add to list', () => {
        testList.add('test');
        assert.isTrue(testList.list.includes('test'));
    });

    it('should update file after add to list', () => {
        testList.add('update');
        const obj = fs.readFileSync(join(adDir, '.adlist.json'));
        const list = JSON.parse(obj)['whitelist'];
        assert.isTrue(list.includes('update'));
    });

    it('should update file after removed from list', () => {
        testList.remove('update');
        const obj = fs.readFileSync(join(adDir, '.adlist.json'));
        const list = JSON.parse(obj)['whitelist'];
        assert.iFalse(list.includes('update'));
    });


});