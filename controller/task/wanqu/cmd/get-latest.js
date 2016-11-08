"use strict";

const wanquUtil = require('../util');
const util = require(`${global.__nasha.APP_CONTROLLER}/util`);
const model = require(global.__nasha.APP_MODEL);

/* 获取最新一期的内容 */
module.exports = async (body = {}, ctx) => {
    let ipObject = await util.getIP(ctx);
    /* 记录IP信息 */
    await model.leanCloud.wanqu.log(ipObject, `最新: 5篇文章`);
    /* 处理新用户数据 */
    await wanquUtil.newUser(body.mac || '');

    let dbData = await model.leanCloud.wanqu.getLatest();
    return await wanquUtil.generateResponse({
        "db": dbData,
        "clientVersion": body.clientVersion || ''
    });
}
