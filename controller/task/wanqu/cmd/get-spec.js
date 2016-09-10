"use strict";

const wanquUtil = require('../util');
const util = require(`${global.__nasha.APP_CONTROLLER}/util`);
const model = require(global.__nasha.APP_MODEL);

/* 获取指定某一期 */
module.exports = function *(body, ctx) {
    if(!body || !body.issue) return {"success": false};

    let ipObject = yield util.getIP(ctx);
    yield {
        "logIP": model.leanCloud.wanqu.log(ipObject, `指定某期: 第${body.issue}期`),
        /* 处理新用户数据 */
        "newUser": wanquUtil.newUser(body.mac || '')
    };

    let dbData = yield model.leanCloud.wanqu.getSpec(body.issue);
    return yield wanquUtil.generateResponse({
        "db": dbData,
        "clientVersion": body.clientVersion || ''
    });
}
