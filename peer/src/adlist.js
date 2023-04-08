const fs = require('fs');
const { join } = require('path');
const { adDir } = require('./defaults');

class AdList {
    /**
     * For tracking user uploaded ads (whitelist) and user deleted ads (blacklist). Stored on peers disk in adDir in json file called '.adlist.json'.
     * 
     * JSON file format:
     * 
     * {
     * 
     *       "blacklist": [
     *          ...
     *       ],
     *
     *       "whitelist": [
     *           ...
     *       ]
     *   }
     * 
     * lists contain hashnames of ad files
     * 
     * @param {string} name - ('white'|'black') list 
     */
    constructor(name) {
        this.list = [];

        const fPath = join(adDir, '.adlist.json');

        // check for list on disk
        if (fs.existsSync(fPath)) {
            const adList = require(fPath);
            this.list = adList[name] || [];
        }
    }

    /**
     * @private
     * Update the file to reflect changes to list stored in memory
     */
    #update() {
        throw new Error("Not yet implemented");
    }

    /**
     * Add a file to this list
     * @param {string} id - hash id name of file 
     */
    add(id) {
        throw new Error("Not yet implemented");
        this.#update();
    }

    /**
     * Remove a file form the list
     * @param {string} id - hash id name of file
     */
    remove(id) {
        throw new Error("Not yet implemented");
        this.#update();
    }

    /**
     * Check if a file is on the list
     * @param {string} id - hash id name of file
     * @returns true if id is contained on the list, false otherwise
     */
    has(id) {
        return this.list.includes(id);
    }

}

module.exports = AdList;