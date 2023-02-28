const { assert } = require("chai");
const { isValidType } = require("../src/validators");

describe('validators', () => {

    it('#isValidType should support png', () => {
        assert.equal(isValidType('test.png'), true);
    });

    it('#isValidType should support jpg', () => {
        assert.equal(isValidType('test.jpg'), true);
    });
    
    it('#isValidType should support JPG', () => {
        assert.equal(isValidType('test.JPG'), true);
    });

    it('#isValidType should support jpeg', () => {
        assert.equal(isValidType('test.jpeg'), true);
    });

    it('#isValidType should not support bad ext', () => {
        assert.equal(isValidType('test.dfkjvn'), false);
    });
    
});