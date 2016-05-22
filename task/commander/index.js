"use strict"

const commander = require('commander');

module.exports = function() {
    commander
        .version('0.0.1')
        .option('-t, --test-args [type]', 'Test arguments')
        .parse(process.argv);

    console.log('commander:', commander['testArgs']);

    return function *(next) {
        yield next;
    }
}
