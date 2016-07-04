"use strict";
const util = require('../../../util');
const wanquUtil = require('../wanqu-util');

/* 获取随机的几篇文章 */
module.exports = function *(ctx) {
    yield util.leanCloud.wanquLog(util.getIP(ctx));
    /* TBD: 获取随机文章 */
}
