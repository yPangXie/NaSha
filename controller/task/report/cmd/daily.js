"use strict"

const urllib = require('urllib');

const aoConfig = require(`${global.__nasha.APP_ROOT}/.config`).alertover;
const util = require(`${global.__nasha.APP_CONTROLLER}/util`);
const model = require(global.__nasha.APP_MODEL);

/* 生成报表信息 */
module.exports = async (ctx, date = '') => {
    let yesterday = util.getYesterday(date);
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

    const aoReport = `在刚过去的大概一天的时间里\n发生了${dailyReport.access_count}次请求\nwanqu日报爬虫爬了${dailyReport.wanqu_spider_count}篇文章(目前共${dailyReport.wanqu_total})篇\nworkflow爬虫搞下来${dailyReport.workflow_spider_count}个新发布的工作流(目前共${dailyReport.workflow_total}个)\n最后, 昨个儿读了${dailyReport.read_count}篇文章\n完事儿.`;
    urllib.request(aoConfig.api, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            source: aoConfig.source,
            receiver: aoConfig.receiver,
            content: aoReport,
            title: 'NaSha Daily Report'
        }
    });

    // await model.leanCloud.helper.sms(smsObject);
    return {"success": true, "message": "应该是顺利的发出去了.."};
}
