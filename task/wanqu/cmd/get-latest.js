"use strict";
const util = require('../../../util');
const wanquUtil = require('../wanqu-util');

/* 获取最新一期的内容 */
module.exports = function *(ctx) {
    yield util.leanCloud.wanqu.log(util.getIP(ctx), `获取最新的5篇文章`);
    /* 先判断DB中是否有缓存 */
    let dbData = yield util.leanCloud.wanqu.getLatest();
    return wanquUtil.generateResponse(dbData);
}
