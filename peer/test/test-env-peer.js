const assert = require('assert');
const chalk = require('chalk');
var log = require('fancy-log');
//https://github.com/toddbluhm/env-cmd-examples/blob/master/examples/rc-file/index.js

/**
 * 
 * @param {*} title 
 * @param {*} test 
 * @returns Proceed with tests if the NODE_ENV var is set as `test`, else it is skipped
 * We want to focus on testing other features of the peers, this is a filler test!
 */

function ifNodeEnvTest(title, test) {
    // Adapted from: https://stackoverflow.com/a/48817596/21074625
    const condition = process.env.NODE_ENV === 'test';
    return condition ? it(title, test) : it.skip(title, test);
}

ifNodeEnvTest('Test_envs', (done) => {
    // Test things IFF NODE_ENV is test, else skipped rip
    log.info(chalk.bold.italic(`Running test: ` + chalk.bgWhite.bold.blueBright(`${process.env.TEST_NAME}`)));
    log.info(chalk(`Node Environment: `) + chalk.bgCyanBright.bold(`${process.env.NODE_ENV}`));
    log.info(`.Env file: ` +  chalk.bgCyanBright.bold(`${process.env.ENVVAR}`));
    log.info(`.Env file path: ` +  chalk.bgCyanBright.bold(`${process.env.ENV_PATH}`));

    assert(process.env.NODE_ENV === 'test');
    assert(process.env.ENVVAR === 'exists');
    assert(process.env.ENV_PATH === './.env-cmdrc');
    assert(process.env.PEER_PORT === '69696');
    log(chalk.blueBright('All asserts pass!'));
    
    // Finish running basic env var tests
    done();
});

