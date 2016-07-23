"use strict";
const util = require('../../../util');
const wanquUtil = require('../util');
const debugSymbol = '[Wanqu:get-spec]';

/* 获取指定某一期 */
module.exports = function *(body, ctx) {
    if(!body || !body.issue) return {"success": false};

    let ipObject = yield util.log.debugExecDuration(`${debugSymbol}Get ip spend`, function *() {
        return yield util.getIP(ctx);
    });

    yield util.log.debugExecDuration(`${debugSymbol}Store log to leancloud`, function *() {
        yield util.leanCloud.wanqu.log(ipObject, `指定某期: 第${body.issue}期`);
    });


    /* 先判断DB中是否有缓存 */
    let dbData = yield util.log.debugExecDuration(`${debugSymbol}Get specific issue-${body.issue}`, function *() {
        return yield util.leanCloud.wanqu.getSpec(body.issue);
    });
    return wanquUtil.generateResponse(dbData);
}
