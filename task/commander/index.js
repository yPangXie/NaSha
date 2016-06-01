"use strict"

const commander = require('commander');
const parse = require('co-body');
const weiboCMD = require('../weibo').cmd;
const wanquCMD = require('../wanqu').cmd;

module.exports = function(router, routerPrefix) {
    router.post(`${routerPrefix}/cmd`, function *() {
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
            case "wanqu":
                if(action == 'getLatest') {
                    result = yield wanquCMD.getLatest();
                }

                if(action == 'getSpec') {
                    result = yield wanquCMD.getSpec(body);
                }
            break;
        }

        return this.body = result;
    });

    return function *(next) {
        yield next;
    }
}
