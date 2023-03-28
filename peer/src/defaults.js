const path = require("path")

const adDir = path.join(process.cwd(), process.env.AD_DIR || 'ads');

const ledgerFileName = process.env.NODE_ENV === 'production' ? 'activity.log' : 'activity.dev.log';

module.exports = {
    adDir,
    ledgerFileName
}