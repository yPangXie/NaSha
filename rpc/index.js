"use strict"

const parse = require('co-body');

const taskBase = '../controller/task';
// const weiboCMD = require(`${taskBase}/weibo`).cmd;
const wanquCMD = require(`${taskBase}/wanqu`).cmd;
const workflowCMD = require(`${taskBase}/workflow`).cmd;
const reportCMD = require(`${taskBase}/report`).cmd;
const readCMD = require(`${taskBase}/read`).cmd;
const mweb = require(`${taskBase}/mweb`).cmd;

module.exports = function(router, routerPrefix) {
    /* POST: 内部暴露的自定义接口. 调用方需要满足这些接口的调用规则 */
    router.post(`${routerPrefix}/cmd`, function *() {
        let body = yield parse(this);
        let action = body['action'] || '';
        let result = {};

        switch(body['type'] || '') {
            // case "weibo":
            //     if(action === 'sendMessage') result = yield weiboCMD.sendMessage(body, this);
            //     if(action == 'detectToken') result = yield weiboCMD.detectToken(this);
            // break;
            case "wanqu":
                if(action == 'getLatest') result = yield wanquCMD.getLatest(body, this);
                if(action == 'getSpec') result = yield wanquCMD.getSpec(body, this);
                if(action == 'spider') result = yield wanquCMD.spider(body, this);
                if(action == 'getRandom') result = yield wanquCMD.getRandom(body, this);
            break;
            case "workflow":
                if(action == 'spider') result = yield workflowCMD.spider(body, this);
                if(action == 'upload') result = yield workflowCMD.grabAndUpload(body, this);
            break;
            case "report":
                if(action == "daily") result = yield reportCMD.daily(this);
                if(action == "countDown") result = yield reportCMD.countDown(this);
            break;
            case "read":
                if(action == "store") result = yield readCMD.store(body, this);
                if(action == "list") result = yield readCMD.list(body, this);
                if(action == "daily") result = yield readCMD.daily(this);
            break;
        }

        return this.body = result;
    });

    /*Weixin公众号接入校验 */
    router.get(`${routerPrefix}/weixin`, function *() {
        return this.body = readCMD.comefromWeixin(this);
    });

    /* 微信公众号数据交互接口 */
    router.post(`${routerPrefix}/weixin`, function *() {
        /* 收到消息 */
        let recieveMessage = yield readCMD.recieveWeixinMessage(this);
        this.set('Content-Type', 'text/xml; charset=utf-8');
        return this.body = recieveMessage || 'success';
    });

    /* MWeb的Metaweblog API接口. 非内部通用接口, 因要适配一定的接口规范 */
    router.post(`${routerPrefix}/mweb`,function *() {
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
