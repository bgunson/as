const { assert } = require("chai");
const fs = require('fs');
const { logicalTime } = require("../src/activity-logger");

describe('activity-logger', () => {

    it('#logicalTime.getLatestFromLog should return a number', async () => {
        fs.writeFileSync("activity.log", "69 test\n");
        let latest = await logicalTime.getLatestFromLog();
        assert.equal(latest, 69);
    });
    
    it('#logicalTime.updateLatestLogTime should return number from log', async () => {
        await logicalTime.updateLatestLogTime([1,2,3]);
        // throw new Error(logicalTime.latest)
        assert.equal(logicalTime.latest, 69);
    });

    it('#logicalTime.updateLatestLogTime should update latest', async () => {
        fs.writeFileSync("activity.log", "0 test\n");
        await logicalTime.updateLatestLogTime([1,2,3]);
        assert.equal(logicalTime.latest, 3);
    });


});