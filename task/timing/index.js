"use strict"

const CronJob = require('cron').CronJob;
const co = require('co');
const util = require('../../util');
const wanqu = require('../wanqu');
const workflow = require('../workflow');
const report = require('../report');
const countDown = require('../count-down');

/* cron模块的时间定义
 1. second minite hour day-of-month month day-of-week
 2. 00 30 11 * * 1-5: 没个"周一到周五"的11点半执行
 3. 最后一位: 0和7都表示周日
 */
module.exports = function () {
    /* 每10分钟检测一次Wanqu日报是否有新的一期发布 */
    new CronJob('00 */10 * * * *', function() {
        co(function *() {
            let hasLatest = yield wanqu.timing.detectLatest();
            let currentDate = new Date();
            if(hasLatest.success) {
                let spiderResult = yield wanqu.cmd.spider({"issue": hasLatest.issue});
                yield util.leanCloud.util.log(`Wanqu - ${spiderResult.message}`);
            }
        });
    }, function(e) {
        co(function *() {
            yield util.leanCloud.util.log(`Wanqu - Cron job stopped`, e);
            yield util.leanCloud.sms({
                "template": 'Cron_Job_Status',
                "cron_job_name": "Wanqu爬虫定时任务"
            });
        });
    }, true, 'Asia/Shanghai');

    /* 每10分钟检测一次Packal上workflow的总数是否有变化 */
    new CronJob('00 */10 * * * *', function() {
        co(function *() {
            let hasLatest = yield workflow.timing.detectLatest();
            let currentDate = new Date();
            if(hasLatest.success) {
                let spiderResult = yield workflow.cmd.spider({"urls": hasLatest.urls}, this);
                yield util.leanCloud.util.log(`Workflow - ${spiderResult.message}`);
            }
        });
    }, function(e) {
        co(function *() {
            yield util.leanCloud.util.log(`Workflow - Cron job stopped.`, e);
            yield util.leanCloud.sms({
                "template": 'Cron_Job_Status',
                "cron_job_name": "Workflow爬虫定时任务"
            });
        });
    }, true, 'Asia/Shanghai');

    /* 每天晚上10点(北京时间), 发送最近一天的报表信息 */
    new CronJob('00 00 22 * * *', function() {
        co(function *() {
            let dailyReport = yield report.timing.daily();
            let smsObject = {
                "template": 'Daily_Report'
            };

            for(let key in dailyReport) {
                smsObject[key] = dailyReport[key];
            }

            yield util.leanCloud.sms(smsObject);
        });
    }, function(e) {
        co(function *() {
            yield util.leanCloud.util.log(`Daily report - stopped.`, e);
            yield util.leanCloud.sms({
                "template": 'Cron_Job_Status',
                "cron_job_name": "Daily Report定时任务"
            });
        });
    }, true, 'Asia/Shanghai');

    /* 每天晚上10点(北京时间), 发送倒计时信息 */
    new CronJob('00 00 22 * * *', function() {
        co(function *() {
            let countDownResult = yield countDown.timing.countDown("2016-10-01 00:00:00");
            let today = new Date();
            yield util.leanCloud.sms({
                "template": 'Count_Down',
                "now": `${today.getFullYear()}年${(today.getMonth() + 1)}月${today.getDate()}日`,
                "target_date": "2016年10月1日",
                "time": `大约${countDownResult.days}天`
            });
        });
    }, function(e) {
        co(function *() {
            yield util.leanCloud.util.log(`Count down - stopped.`, e);
            yield util.leanCloud.sms({
                "template": 'Count_Down',
                "cron_job_name": "倒计时定时任务"
            });
        });
    }, true, 'Asia/Shanghai');

    return function *(next) {yield next;}
}
