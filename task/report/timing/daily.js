"use strict"

const util = require('../../../util');

/* 生成报表信息 */
module.exports = function *(ctx) {
    let yesterday = util.getYesterday();
    let wanquTotal = yield util.leanCloud.wanquTotal();
    let workflowTotal = yield util.leanCloud.workflowTotal();
    let wanquLogYesterday = yield util.leanCloud.wanquLogDaily(yesterday.toLocaleDateString() + ' 22:00:00');
    let wanquSpiderYesterday = yield util.leanCloud.wanquSpiderDaily(yesterday.toLocaleDateString() + ' 22:00:00');
    let workflowSpiderYesterday = yield util.leanCloud.workflowSpiderDaily(yesterday.toLocaleDateString() + ' 22:00:00');

    return {
        "access_count": wanquLogYesterday.length,
        "wanqu_spider_count": wanquSpiderYesterday.length,
        "wanqu_total": wanquTotal,
        "workflow_spider_count": workflowSpiderYesterday.length,
        "workflow_total": workflowTotal
    };
}
