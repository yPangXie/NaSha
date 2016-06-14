"use strict";
const util = require('../../../util');
const wanquUtil = require('../wanqu-util');

/* 获取最新一期的内容 */
module.exports = function *(ctx) {
    yield util.leanCloud.wanquLog(util.getIP(ctx));
    /* 先判断DB中是否有缓存 */
    let dbData = yield util.leanCloud.getLatestArticle();
    return wanquUtil.generateResponse(dbData);
}
