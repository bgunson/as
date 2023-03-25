/**
 * HTTP endpoints for peer server running on a client's machine
 */

const express = require('express');
const router = express.Router();

module.exports = (handlers) => {

    router.get(`/`,
        (req, res) => {
            res.send(`Peer server is live.`);
        }
    );

    /**
     * @route:  GET http://localhost:$PORT/version/
     * @desc:   Get current version of peer server from package.json
     * @access: PRIVATE
     */
    router.get('/version',
        (req, res) => {
            try {
                const packagePath = require.resolve('../package.json');
                const { version } = require(packagePath);
                res.send(`Current peer version is: ${version}`);
            } catch (error) {
                // Prevent crash incase of problem resolving path
                console.error(error);
                res.status(501).send('Error retrieving version number!');
            }
        }
    );

    /**
     * @route:  GET http://localhost:$PORT/ad/:id
     * @desc:   Get a ad (file) by it's id (name)
     * @access: PRIVATE
     */
    router.get('/ad/:id',
        (req, res) => {
            try{
                const ad = handlers.getAd(req.params.id);
                res.sendFile(ad);
            } catch (error){
                console.error(error);
                res.status(501).send(`Error retrieving ad file!`);
            }
        }
    );

    /**
     * @route:  POST http://localhost:$PORT/ad/
     * @desc:   Upload an ad to be served by this peer
     * @access: PRIVATE
     */
    router.post('/ad', 
        (req, res) => {
            try{
                handlers.uploadAd(req.params.id);
                //ToDo
            } catch(error){
                console.error(error);
                res.status(501).send(`Error uploading ad file!`);
            }    
        }
    );

    /**
     * @route:  DELETE http://localhost:PORT/ad/:id
     * @desc:   Delete an ad by id (name)
     * @access: PRIVATE
     */
    router.delete('/ad/:id',
        (req, res) => {
            try{
                handlers.deleteAd(req.params.id);
                //ToDo
            } catch(error){
                console.error(error);
                res.status(501).send(`Error deleting ad file!`);
            }
        }
    );

    return router;
}
