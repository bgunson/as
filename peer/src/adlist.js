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
        const fPath = join(adDir, '.adlist.json');

        //check from blacklist
        this.list.filter(id => id.startsWith('black')).forEach((id) => {
            //check if file exist in system
            if (fs.existsSync(join(adDir, id))) {
                fs.unlink(join(adDir, id), (err) => {
                    if (err) throw err;
                });
            }
        });
    }

    /**
     * Add a file to this list
     * @param {string} id - hash id name of file 
     */
    add(id) {
        this.list.push(id);
        //console.log(this.list);
        this.#update();
    }

    /**
     * Remove a file form the list
     * @param {string} id - hash id name of file
     */
    remove(id) {
        const index = this.list.indexOf(id);
        // Check if name of file is in list, -1 if it isnt
        if (index !== -1) {
            this.list.splice(index, 1);
            this.#update(); 
        }

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