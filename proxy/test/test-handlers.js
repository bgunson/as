const { createServer } = require("http");
const { Server } = require("socket.io");
const Client = require("socket.io-client");
const assert = require("chai").assert;

const Peers = require('../src/peers');
const registerHandler = require('../src/handlers');

describe("handler", () => {
    let io, serverSocket, clientSocket, handler;
    let peers = new Peers();

    before((done) => {
        const httpServer = createServer();
        io = new Server(httpServer);
        httpServer.listen(() => {
            const port = httpServer.address().port;
            clientSocket = new Client(`http://localhost:${port}`);

            io.on("connection", (socket) => {
                serverSocket = socket;
                handler = registerHandler(io, socket, peers);
            });

            clientSocket.on("connect", done);
        });
    });

    after(() => {
        io.close();
        clientSocket.close();
    });

    it("'get-peer-list' work", (done) => {
        handler.getPeerList();
        clientSocket.once('give-peer-list', (list) => {
            assert.deepEqual(list, peers.getPeerList());
            done();
        })
    });

    // TODO: implement actual test case when implementing
    // it("'replicate' should work", (done) => {
    //     handler.replicate(null);
    //     clientSocket.once('replcate', (ad) => {
    //         // assert something
    //         done();
    //     })
    // });

    it("'disconnect' should work", (done) => {
        handler.onDisconnect();
        clientSocket.once('give-peer-list', (list) => {
            // list should be empty
            assert.deepEqual(list, peers.getPeerList());
            done();
        })
    });

});