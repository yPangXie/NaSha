"use strict";
const util = require('../../../util');
const wanquUtil = require('../util');
const debugSymbol = '[Wanqu:get-latest]';

/* 获取最新一期的内容 */
module.exports = function *(ctx) {
    let ipObject = yield util.getIP(ctx);
    yield util.leanCloud.wanqu.log(ipObject, `最新: 5篇文章`);

    /* 先判断DB中是否有缓存 */
    let dbData = yield util.leanCloud.wanqu.getLatest();
    return wanquUtil.generateResponse(dbData);
}
