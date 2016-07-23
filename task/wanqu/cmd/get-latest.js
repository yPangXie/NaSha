"use strict";
const util = require('../../../util');
const wanquUtil = require('../util');
const debugSymbol = '[Wanqu:get-latest]';

/* 获取最新一期的内容 */
module.exports = function *(ctx) {
    let ipObject = yield util.log.debugExecDuration(`${debugSymbol}Get ip spend`, function *() {
        return yield util.getIP(ctx);
    });

    yield util.log.debugExecDuration(`${debugSymbol}Store log to leancloud`, function *() {
        yield util.leanCloud.wanqu.log(ipObject, `最新: 5篇文章`);
    });

    /* 先判断DB中是否有缓存 */
    let dbData = yield util.log.debugExecDuration(`${debugSymbol}Get latest`, function *() {
        return yield util.leanCloud.wanqu.getLatest();
    });
    return wanquUtil.generateResponse(dbData);
}
