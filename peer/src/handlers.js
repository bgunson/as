const path = require('path');
const fs = require('fs');

const adDir = path.join(process.cwd(), 'ads'); // ad dir


/**
 * Choose an ad randomly from peer with the assumption that peer has an ad
 * @returns path to peer's ad relative to current working directory
 */
const getAd = () => {
    const fallbacks = fs.readdirSync(adDir);
    const ad = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    return path.join(adDir, ad);
}



module.exports = {
    getAd
}