"use strict"

const util = require('../../../util');

/* 生成报表信息 */
module.exports = function *(ctx, date) {
    let yesterday = util.getYesterday(date || '');
    let wanquTotal = yield util.leanCloud.wanqu.total();
    let workflowTotal = yield util.leanCloud.workflows.total();
    let wanquLogYesterday = yield util.leanCloud.wanqu.logDailyCount(yesterday.toLocaleDateString() + ' 22:00:00');
    let wanquSpiderYesterday = yield util.leanCloud.wanqu.spiderDaily(yesterday.toLocaleDateString() + ' 22:00:00');
    let workflowSpiderYesterday = yield util.leanCloud.workflows.spiderDaily(yesterday.toLocaleDateString() + ' 22:00:00');

    let dailyReport = {
        "access_count": wanquLogYesterday.length,
        "wanqu_spider_count": wanquSpiderYesterday.length,
        "wanqu_total": wanquTotal,
        "workflow_spider_count": workflowSpiderYesterday.length,
        "workflow_total": workflowTotal
    };

    let smsObject = {
        "template": 'Daily_Report'
    };

    for(let key in dailyReport) {
        smsObject[key] = dailyReport[key];
    }

    yield util.leanCloud.helper.sms(smsObject);
}
