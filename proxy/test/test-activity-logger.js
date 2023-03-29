const { assert } = require("chai");
const fs = require('fs');
const { logicalTime } = require("../src/activity-logger");

describe('activity-logger', () => {

    it('#logicalTime.getLatestFromLog should return a number', async () => {
        fs.writeFileSync("activity.log", "69 test\n");
        let latest = await logicalTime.getLatestFromLog();
        assert.equal(latest, 69);
    });

    it('#logicalTime.getLatestFromLog should ignore excess newlines chars', async () => {
        fs.writeFileSync("activity.log", "69 test\n\n\n");
        let latest = await logicalTime.getLatestFromLog();
        assert.equal(latest, 69);
    });

    it('#logicalTime.getLatestFromLog should return 0 if file empty', async () => {
        fs.writeFileSync("activity.log", "");
        let latest = await logicalTime.getLatestFromLog();
        assert.equal(latest, 0);
    });

    it('#logicalTime.getLatestFromLog should return 0 if file empty (single newline char)', async () => {
        fs.writeFileSync("activity.log", "\n");
        let latest = await logicalTime.getLatestFromLog();
        assert.equal(latest, 0);
    });
    
    
    it('#logicalTime.updateLatestLogTime should return number from log not peer', async () => {
        fs.writeFileSync("activity.log", "12 test\n");
        await logicalTime.updateLatestLogTime([1,2,3]);
        assert.equal(logicalTime.latest, 12);
    });

    it('#logicalTime.updateLatestLogTime should update latest', async () => {
        fs.writeFileSync("activity.log", "0 test\n");
        await logicalTime.updateLatestLogTime([1,2,3]);
        assert.equal(logicalTime.latest, 3);
    });


});