"use strict";
const util = require('../../../util');
const wanquUtil = require('../util');

/* 获取最新一期的内容 */
module.exports = function *(body, ctx) {
    let ipObject = yield util.getIP(ctx);
    yield util.leanCloud.wanqu.log(ipObject, `最新: 5篇文章`);

    /* 处理新用户数据 */
    yield wanquUtil.newUser(body.mac || '');

    let dbData = yield util.leanCloud.wanqu.getLatest();
    return yield wanquUtil.generateResponse({
        "db": dbData,
        "clientVersion": body.clientVersion || ''
    });
}
