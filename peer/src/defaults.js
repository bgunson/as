const path = require("path")

const adDir = path.join(process.cwd(), process.env.AD_DIR || 'ads');


module.exports = {
    adDir
}