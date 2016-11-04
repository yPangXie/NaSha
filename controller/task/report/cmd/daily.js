"use strict"

const util = require(`${global.__nasha.APP_CONTROLLER}/util`);
const model = require(global.__nasha.APP_MODEL);

/* 生成报表信息 */
module.exports = async (ctx, date) => {
    let yesterday = util.getYesterday(date || '');
    let comboData = await Promise.all([
        model.leanCloud.wanqu.logDailyCount(yesterday.toLocaleDateString() + ' 22:00:00'),
        model.leanCloud.wanqu.spiderDaily(yesterday.toLocaleDateString() + ' 22:00:00'),
        model.leanCloud.wanqu.total(),
        model.leanCloud.workflows.spiderDaily(yesterday.toLocaleDateString() + ' 22:00:00'),
        model.leanCloud.workflows.total(),
        model.leanCloud.read.daily(yesterday.toLocaleDateString() + ' 22:00:00')
    ]);

    let dailyReport = {
        "access_count": comboData[0].length,
        "wanqu_spider_count": comboData[1].length,
        "wanqu_total": comboData[2],
        "workflow_spider_count": comboData[3].length,
        "workflow_total": comboData[4],
        "read_count": comboData[5].length
    };

    let smsObject = {
        "template": 'Daily_Report'
    };

    for(let key in dailyReport) {
        smsObject[key] = dailyReport[key];
    }

    await model.leanCloud.helper.sms(smsObject);
    return {"success": true, "message": "应该是顺利的发出去了.."};
}
