"use strict"

const util = require('../../../util');
const model = require('../../../model');

/* 生成报表信息 */
module.exports = function *(ctx, date) {
    let yesterday = util.getYesterday(date || '');
    let wanquTotal = yield model.leanCloud.wanqu.total();
    let workflowTotal = yield model.leanCloud.workflows.total();
    let wanquLogYesterday = yield model.leanCloud.wanqu.logDailyCount(yesterday.toLocaleDateString() + ' 22:00:00');
    let wanquSpiderYesterday = yield model.leanCloud.wanqu.spiderDaily(yesterday.toLocaleDateString() + ' 22:00:00');
    let workflowSpiderYesterday = yield model.leanCloud.workflows.spiderDaily(yesterday.toLocaleDateString() + ' 22:00:00');
    let readYesterday = yield model.leanCloud.read.daily(yesterday.toLocaleDateString() + ' 22:00:00');

    let dailyReport = {
        "access_count": wanquLogYesterday.length,
        "wanqu_spider_count": wanquSpiderYesterday.length,
        "wanqu_total": wanquTotal,
        "workflow_spider_count": workflowSpiderYesterday.length,
        "workflow_total": workflowTotal,
        "read_count": readYesterday.length
    };

    let smsObject = {
        "template": 'Daily_Report'
    };

    for(let key in dailyReport) {
        smsObject[key] = dailyReport[key];
    }

    yield model.leanCloud.helper.sms(smsObject);
    return {"success": true, "message": "应该是顺利的发出去了.."};
}
