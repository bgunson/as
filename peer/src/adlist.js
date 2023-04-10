const fs = require('fs');
const { join } = require('path');
const { adDir } = require('./defaults');

const fPath = join(adDir, '.adlist.json');


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
     * @param {string} name - 'whitelist' | 'blacklist'
     */
    constructor(name) {
        this.name = name;        
        // check for list on disk
        try {
            const adList = require(fPath);
            this._list = new Set(adList[this.name]);
        } catch(e) {
            this._list = new Set();
        }
    }

    get list() {
        return Array.from(this._list);
    }

    /**
     * @private
     * Update the file to reflect changes to list stored in memory
     */
    #update() {

        let adList = {};

        try {
            adList = require(fPath);
        } catch(e) {
            // couldnt parse an existing ad list
        }

        adList[this.name] = this.list;

        fs.writeFileSync(fPath, JSON.stringify(adList, null, 2));
    }

    /**
     * Add a file to this list
     * @param {string} id - hash id name of file 
     */
    add(id) {
        this._list.add(id);
        //console.log(this.list);
        this.#update();
    }

    /**
     * Remove a file form the list
     * @param {string} id - hash id name of file
     */
    remove(id) {
        this._list.delete(id);
        this.#update();
    }

    /**
     * Check if a file is on the list
     * @param {string} id - hash id name of file
     * @returns true if id is contained on the list, false otherwise
     */
    has(id) {
        return this._list.has(id);
    }

}

module.exports = AdList;