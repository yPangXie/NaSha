"use strict";

const wanquUtil = require('../util');
const util = require(`${global.__nasha.APP_CONTROLLER}/util`);
const model = require(global.__nasha.APP_MODEL);

/* 获取指定某一期 */
module.exports = async (body, ctx) => {
    if(!body || !body.issue) return {"success": false};

    let ipObject = await util.getIP(ctx);
    /* 来路ip, 日志打点 */
    await model.leanCloud.wanqu.log(ipObject, `指定某期: 第${body.issue}期`);
    /* 处理新用户数据 */
    await wanquUtil.newUser(body.mac || '');

    let dbData = await model.leanCloud.wanqu.getSpec(body.issue);
    return await wanquUtil.generateResponse({
        "db": dbData,
        "clientVersion": body.clientVersion || ''
    });
}
