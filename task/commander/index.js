"use strict"

const commander = require('commander');
const parse = require('co-body');
const weiboCMD = require('../weibo').cmd;

module.exports = function(router) {
    router.post('/cmd', function *() {
        let body = yield parse(this);

        let type = body['type'] || '';
        let action = body['action'] || '';

        switch(type) {
            case "weibo":
                if(action === 'sendMessage') {
                    yield weiboCMD.sendMessage(body);
                }
            break;
        }
    });

    return function *(next) {
        yield next;
    }
}
