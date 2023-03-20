const { assert } = require("chai");
const { getDefaultAd } = require("../src/defaults");
const fs = require('fs');

describe('defaults', () => {

    it('should return a valid default ad path', () => {
        const ad = getDefaultAd();
        assert.equal(fs.existsSync(ad), true);
    });
    
});