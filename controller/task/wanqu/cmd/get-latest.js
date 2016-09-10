"use strict";

const wanquUtil = require('../util');
const util = require(`${global.__nasha.APP_CONTROLLER}/util`);
const model = require(global.__nasha.APP_MODEL);

/* 获取最新一期的内容 */
module.exports = function *(body, ctx) {
    let ipObject = yield util.getIP(ctx);
    yield {
        /* 记录IP信息 */
        "logIP": model.leanCloud.wanqu.log(ipObject, `最新: 5篇文章`),
        /* 处理新用户数据 */
        "newUser": wanquUtil.newUser(body.mac || '')
    };

    let dbData = yield model.leanCloud.wanqu.getLatest();
    return yield wanquUtil.generateResponse({
        "db": dbData,
        "clientVersion": body.clientVersion || ''
    });
}
