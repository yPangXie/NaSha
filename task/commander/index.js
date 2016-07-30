"use strict"

const parse = require('co-body');
const weiboCMD = require('../weibo').cmd;
const wanquCMD = require('../wanqu').cmd;
const workflowCMD = require('../workflow').cmd;
const mweb = require('../mweb').cmd;

module.exports = function(router, routerPrefix) {
    /* 内部暴露的自定义接口. 调用方需要满足这些接口的调用规则 */
    router.post(`${routerPrefix}/cmd`, function *() {
        let body = yield parse(this);
        let action = body['action'] || '';
        let result = {};

        switch(body['type'] || '') {
            case "weibo":
                if(action === 'sendMessage') result = yield weiboCMD.sendMessage(body, this);
                if(action == 'detectToken') result = yield weiboCMD.detectToken(this);
            break;
            case "wanqu":
                if(action == 'getLatest') result = yield wanquCMD.getLatest(this);
                if(action == 'getSpec') result = yield wanquCMD.getSpec(body, this);
                if(action == 'spider') result = yield wanquCMD.spider(body, this);
                if(action == 'detectLatest') result = yield wanquCMD.detectLatest(this);
                if(action == 'getRandom') result = yield wanquCMD.getRandom(body, this);
            break;
            case "workflow":
                if(action == 'spider') result = yield workflowCMD.spider(body, this);
                if(action == 'upload') result = yield workflowCMD.grabAndUpload(body, this);
            break;
        }

        return this.body = result;
    });

    /* MWeb的Metaweblog API接口. 非内部通用接口, 因要适配一定的接口规范 */
    router.post(`${routerPrefix}/mweb`, function *() {
        let methodName = '';
        let result = null;
        try {
            methodName = this.request.body.methodCall.methodName[0];
        } catch(e) {}

        switch(methodName) {
            case "blogger.getUsersBlogs":
                result = yield mweb.getUsersBlogs(this);
            break;
            case "metaWeblog.getCategories":
                result = yield mweb.getCategories();
            break;
            case "metaWeblog.newPost":
                result = yield mweb.newPost(this);
            break;
            case "metaWeblog.editPost":
                result = yield mweb.editPost(this);
            break;
        }

        return this.body = result;
    });

    return function *(next) {
        yield next;
    }
}
