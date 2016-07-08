"use strict";
const util = require('../../../util');
const wanquUtil = require('../wanqu-util');

/* 获取指定某一期 */
module.exports = function *(body, ctx) {
    if(!body || !body.issue) return {"success": false};

    yield util.leanCloud.wanqu.log(util.getIP(ctx), `指定某期: 第${body.issue}期`);
    /* 先判断DB中是否有缓存 */
    let dbData = yield util.leanCloud.wanqu.getSpec(body.issue);
    return wanquUtil.generateResponse(dbData);
}
