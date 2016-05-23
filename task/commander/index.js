"use strict"

const commander = require('commander');
const parse = require('co-body');
const weiboCMD = require('../weibo').cmd;

module.exports = function(router) {
    router.post('/cmd', function *() {
        let body = yield parse(this);

        let type = body['type'] || '';
        let action = body['action'] || '';
        let result = {};

        switch(type) {
            case "weibo":
                if(action === 'sendMessage') {
                    result = yield weiboCMD.sendMessage(body);
                }

                if(action == 'detectToken') {
                    result = yield weiboCMD.detectToken();
                }
            break;
        }

        return this.body = result;
    });

    return function *(next) {
        yield next;
    }
}
