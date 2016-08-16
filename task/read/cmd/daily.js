"use strict";

const util = require('../../../util');

/* 获取当天新增的数据, 邮件发送 */
module.exports = function *(ctx) {
    let dateStart = util.getYesterday(`${new Date().toLocaleDateString()} 00:00:00`);
    return yield util.leanCloud.read.listAfterDate(dateStart);
}
