const path = require("path");
const fs = require('fs');

const adDir = path.join(process.cwd(), process.env.AD_DIR || 'ads');

//If ad containing directory, name defined earlier, does not exist in system, create it.
if (!fs.existsSync(adDir)) {
    fs.mkdirSync(adDir, { recursive: true });
};

const ledgerFileName = process.env.NODE_ENV === 'production' ? 'activity.log' : 'activity.dev.log';

const validTypes = ['.png', '.jpeg', '.jpg'];

module.exports = {
    adDir,
    ledgerFileName,
    validTypes
}