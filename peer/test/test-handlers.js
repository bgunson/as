const { assert } = require("chai");
const { getAd } = require("../src/handlers");
const fs = require('fs');

describe('handlers', () => {

    it('should return a valid ad path', () => {
        const ad = getAd();
        assert.equal(fs.existsSync(ad), true);
    });
    
});