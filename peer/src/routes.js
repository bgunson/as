/**
 * HTTP endpoints
 */

const express = require('express');
const router = express.Router();

module.exports = (handlers) => {

    router.get('/version',
        /**
         * @param {express.Request} req - GET /version 
         * @param {express.Response} res  Response: version from package.json
         */
        (req, res) => {
            const { version } = require('../package.json');
            res.send(version);
        }
    );

    router.get('/ad/:id',
        /**
         * Get ad by name
         * @param {Express.Request} req - GET /ad/some-ad-name.jpg
         * @param {Express.Response} res - file
         */
        (req, res) => {
            const ad = handlers.getAd(req.params.id);
            res.sendFile(ad);
        }
    );

    router.post('/ad', 
        /**
         * Upload an ad to be served by this peer
         * @param {Express.Request} req - POST /ad
         * @param {Express.Response} res - status code 
         */
        (req, res) => {
            handlers.uploadAd();
            res.sendStatus(501);        // not implemented
        }
    );


    router.delete('/ad/:id',
        /**
         * Delete an ad by id (name)
         * @param {Express.Request} req - DELETE /ad/:id 
         * @param {Express.Response} res - status code 
         */
        (req, res) => {
            handlers.deleteAd(req.params.id);
            res.sendStatus(501);        // not implemented
        }
    );



    return router;
}
