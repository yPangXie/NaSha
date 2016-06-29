"use strict"

const CronJob = require('cron').CronJob;
const co = require('co');
const util = require('../../util');
const wanqu = require('../wanqu');
const workflow = require('../workflow');

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
                yield util.leanCloud.log(`Wanqu - ${spiderResult.message}`);
            } else {
                yield util.leanCloud.log(`Wanqu - No newer issue`);
            }
        });
    }, function(e) {
        co(function *() {
            yield util.leanCloud.log(`Wanqu - Cron job stopped`, e);
            yield util.leanCloud.sms('Wanqu爬虫定时任务');
        });
    }, true, 'Asia/Shanghai');

    /* 每10分钟检测一次Packal上workflow的总数是否有变化 */
    new CronJob('00 */10 * * * *', function() {
        co(function *() {
            let hasLatest = yield workflow.timing.detectLatest();
            let currentDate = new Date();
            if(hasLatest.success) {
                let spiderResult = yield workflow.cmd.spider({"urls": hasLatest.urls}, this);
                yield util.leanCloud.log(`Workflow - ${spiderResult.message}`);
            } else {
                yield util.leanCloud.log(`Workflow - No newer workflows.`);
            }
        });
    }, function(e) {
        co(function *() {
            yield util.leanCloud.log(`Workflow - Cron job stopped.`, e);
            yield util.leanCloud.sms('Workflow爬虫定时任务');
        });
    }, true, 'Asia/Shanghai');

    return function *(next) {yield next;}
}
