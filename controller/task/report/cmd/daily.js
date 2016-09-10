"use strict"

const util = require(`${global.__nasha.APP_CONTROLLER}/util`);
const model = require(global.__nasha.APP_MODEL);

/* 生成报表信息 */
module.exports = function *(ctx, date) {
    let yesterday = util.getYesterday(date || '');
    let comboYieldData = yield {
        "wanquTotal": model.leanCloud.wanqu.total(),
        "workflowTotal": model.leanCloud.workflows.total(),
        "wanquLogYesterday": model.leanCloud.wanqu.logDailyCount(yesterday.toLocaleDateString() + ' 22:00:00'),
        "wanquSpiderYesterday": model.leanCloud.wanqu.spiderDaily(yesterday.toLocaleDateString() + ' 22:00:00'),
        "workflowSpiderYesterday": model.leanCloud.workflows.spiderDaily(yesterday.toLocaleDateString() + ' 22:00:00'),
        "readYesterday": model.leanCloud.read.daily(yesterday.toLocaleDateString() + ' 22:00:00')
    };
    
    let wanquTotal = comboYieldData.wanquTotal;
    let workflowTotal = comboYieldData.workflowTotal;
    let wanquLogYesterday = comboYieldData.wanquLogYesterday;
    let wanquSpiderYesterday = comboYieldData.wanquSpiderYesterday;
    let workflowSpiderYesterday = comboYieldData.workflowSpiderYesterday;
    let readYesterday = comboYieldData.readYesterday;

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
