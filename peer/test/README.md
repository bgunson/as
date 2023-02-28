# Testing

Uses [mocha](https://mochajs.org/).

To run tests , in the `peer` directory:
```
npm test
```
> To supress console logging set env var `NODE_ENV` to 'test'

To add a test file, in thie folder (`test/`), add `test-nameOfModule.js`. The code from `proxy/test/test-defaults.js` on the proxy is a good boiler plate to copy, just remove the import for the defaults module.

To test socket.io events, see: [https://socket.io/docs/v4/testing/](https://socket.io/docs/v4/testing/).

