"use strict"

const parse = require('co-body');
const weiboCMD = require('../weibo').cmd;
const wanquCMD = require('../wanqu').cmd;
const workflowCMD = require('../workflow').cmd;

module.exports = function(router, routerPrefix) {
    router.post(`${routerPrefix}/cmd`, function *() {
        let body = yield parse(this);

        let type = body['type'] || '';
        let action = body['action'] || '';
        let result = {};

        switch(type) {
            case "weibo":
                if(action === 'sendMessage') result = yield weiboCMD.sendMessage(body, this);
                if(action == 'detectToken') result = yield weiboCMD.detectToken(this);
            break;
            case "wanqu":
                if(action == 'getLatest') result = yield wanquCMD.getLatest(this);
                if(action == 'getSpec') result = yield wanquCMD.getSpec(body, this);
                if(action == 'spider') result = yield wanquCMD.spider(body, this);
            break;
            case "workflow":
                if(action == 'spider') result = yield workflowCMD.spider(body, this);
                if(action == 'upload') result = yield workflowCMD.grabAndUploadWorkflow(body, this);
            break;
        }

        return this.body = result;
    });

    return function *(next) {
        yield next;
    }
}
