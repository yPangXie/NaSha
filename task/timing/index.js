"use strict"

const CronJob = require('cron').CronJob;
const co = require('co');
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
                // let spiderResult = yield wanqu.cmd.spider({"issue": hasLatest.issue});
                console.log(`[${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}] - Wanqu - ${spiderResult.message}`);
            } else {
                console.log(`[${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}] - Wanqu - No newer issue.`);
            }

            /* TBD: 短信提醒 */
        });
    }, null, true, 'Asia/Shanghai');

    /* 每10分钟检测一次Packal上workflow的总数是否有变化 */
    new CronJob('00 */10 * * * *', function() {
        co(function *() {
            let hasLatest = yield workflow.timing.detectLatest();
            let currentDate = new Date();
            if(hasLatest.success) {
                console.log(`[${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}] - Workflow - Latest total number has been stored into DB.`);
            } else {
                console.log(`[${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}] - Workflow - No newer workflows.`);
            }

            /* TBD: 短信提醒 */
        });
    }, null, true, 'Asia/Shanghai');

    return function *(next) {yield next;}
}
