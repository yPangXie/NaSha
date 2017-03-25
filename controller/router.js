"use strict"

const parse = require('co-body');
const taskBase = './task';
const wanquCMD = require(`${taskBase}/wanqu`).cmd;
const workflowCMD = require(`${taskBase}/workflow`).cmd;
const reportCMD = require(`${taskBase}/report`).cmd;
const readCMD = require(`${taskBase}/read`).cmd;
const mweb = require(`${taskBase}/mweb`).cmd;
const home = require('./home');

module.exports = (router, prefix) => {
    /* NaSha read首页 */
    router.get(`${prefix}/read`, async (ctx, next) => {
        await home(ctx, next);
    });

    /* POST: 内部暴露的自定义接口. 调用方需要满足这些接口的调用规则 */
    router.post(`${prefix}/cmd`, async (ctx, next) => {
        let body = await parse(ctx);
        let type = body.type || '';
        let action = body.action || '';
        let result = {};

        /* 如果是Slack的Slash Command, 先处理请求, 匹配对应的action */
        if(body.command && body.command == '/nasha') {
            const commands = body.text.split(' ');
            // type = commands[0];
            // action = commands[1];

            result = {
                "response_type": "in_channel",
                "text": "我了个艹, 好使了?",
                "attachments": [
                    {
                        "text": "这大概会是史上最屌的一个slash command吧(放屁.."
                    }
                ]
            };
        }

        switch(body['type'] || '') {
            case "wanqu":
                if(action == 'getLatest') result = await wanquCMD.getLatest(body, ctx);
                if(action == 'getSpec') result = await wanquCMD.getSpec(body, ctx);
                if(action == 'spider') result = await wanquCMD.spider(body, ctx);
                if(action == 'getRandom') result = await wanquCMD.getRandom(body, ctx);
            break;
            case "workflow":
                if(action == 'spider') result = await workflowCMD.spider(body, ctx);
                if(action == 'upload') result = await workflowCMD.grabAndUpload(body, ctx);
            break;
            case "report":
                if(action == "daily") result = await reportCMD.daily(ctx);
                if(action == "countDown") result = await reportCMD.countDown(ctx);
            break;
            case "read":
                if(action == "store") result = await readCMD.store(body, ctx);
                if(action == "list") result = await readCMD.list(body, ctx);
                if(action == "daily") result = await readCMD.daily(ctx);
                if(action == "remove") result = await readCMD.remove(body, ctx);
            break;
            case "sys":
                if(action == "cleanReadCache") global.__nasha.APP_CACHE.del('readList');
            break;
        }

        return ctx.body = result;
    });

    /*Weixin公众号接入校验 */
    router.get(`${prefix}/weixin`, async ctx => {
        return ctx.body = readCMD.comefromWeixin(ctx);
    });

    /* 微信公众号数据交互接口 */
    router.post(`${prefix}/weixin`, async ctx => {
        /* 收到消息 */
        let recieveMessage = await readCMD.recieveWeixinMessage(ctx);
        ctx.set('Content-Type', 'text/xml; charset=utf-8');
        return ctx.body = recieveMessage || 'success';
    });

    /* MWeb的Metaweblog API接口. 非内部通用接口, 因要适配一定的接口规范 */
    router.post(`${prefix}/mweb`, async (ctx, next) => {
        let methodName = '';
        let result = null;
        try {
            methodName = ctx.request.body.methodCall.methodName[0];
        } catch(e) {}

        switch(methodName) {
            case "blogger.getUsersBlogs":
                result = mweb.getUsersBlogs(ctx);
            break;
            case "metaWeblog.getCategories":
                result = mweb.getCategories();
            break;
            case "metaWeblog.newPost":
                result = await mweb.newPost(ctx);
            break;
            case "metaWeblog.editPost":
                result = await mweb.editPost(ctx);
            break;
        }

        return ctx.body = result;
    });

    return function *() {};
};
