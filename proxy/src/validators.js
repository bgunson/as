const path = require('path');

/**
 * Test a file type from a peer to see if it is supported by the proxy
 * @param {string} fName The name of the file given by a peer
 * @returns true if contained in validTypes, else false
 */
const isValidType = (fName) => {

    // valid types must be accepted as an http header value for 'Content-Type' of form 'image/type' e.g. 'image/png'
    const validTypes = ['.png', '.jpeg', '.jpg'];      // supported image/file types. Add to list if needed.

    const fType = path.extname(fName);
    return validTypes.includes(fType);
}

module.exports = {
    isValidType
}