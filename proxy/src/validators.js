const path = require('path');

/**
 * Test a file type from a peer to see if it is supported by the proxy
 * @param {string} fname The name of the file given by a peer
 * @returns The type of the file if contained in validTypes, else undefined
 */
const isValidType = (fname) => {

    // vali types must be accepted as an http header value for 'Content-Type' of form 'image/type' e.g. 'image/png'
    const validTypes = ['png', 'jpeg', 'jpg'];      // supported image/file types. Add to list if needed.

    const fType = path.extname(fname).split('.')[1];
    return validTypes.find(t => t === fType);
}

module.exports = {
    isValidType
}