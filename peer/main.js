/**
 * @file Client-side code for communicating with the proxy server.
 * Peer (aka host) will stores and serves ad images to the proxy server.
 * Main objective of peer: Wait for 'get-ad' event. Select a random (available) ad and send it to the proxy server.
 * Proxy will then send the received ad image to the client.
 */

//Load env vars from .env file into process.env vars here
require('dotenv').config();

const express = require('express')
const app = express()

const connectPeer = require('./src/connect-peer');
// connect peer to system
const handlers = connectPeer();

app.use(express.static('frontend/public'));     // gui build output folder

// local api
const routes = require('./src/routes');
const router = routes(handlers);
app.use(router);

const server = app.listen(process.env.PORT, () => { // use env port or radnomly assigned if undefined so multiple peers can be spqwned from same machine
    console.log(`Peer frontend & api is being served at http://localhost:${server.address().port}`);
});