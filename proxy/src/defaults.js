const path = require('path');
const fs = require('fs');

const backupDir = path.join(process.cwd(), 'backup_ads'); // backup ad dir

/**
 * Choose a default ad
 * @returns path to backup ad relative to current working directory
 */
const getDefaultAd = () => {
    const fallbacks = fs.readdirSync(backupDir);
    const ad = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    return path.join(backupDir, ad);
}

module.exports = {
    getDefaultAd
}