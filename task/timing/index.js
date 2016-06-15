"use strict"

const CronJob = require('cron').CronJob;
const co = require('co');
const wanqu = require('../wanqu');

/* cron模块的时间定义
 1. second minite hour day-of-month month day-of-week
 2. 00 30 11 * * 1-5: 没个"周一到周五"的11点半执行
 3. 最后一位: 0和7都表示周日
 */
module.exports = function () {
    /* 每个整点检测一次Wanqu日报是否有新的一期发布 */
    new CronJob('00 00 * * * *', function() {
        co(function *() {
            let hasLatest = yield wanqu.timing.detectLatest();
            if(hasLatest.success) {
                let spiderResult = yield wanqu.cmd.spider({"issue": hasLatest.issue});
                console.log(`Cron job [Detect latest issue] finished, result: ${spiderResult.message}`);
            }

            /* TBD: 短信提醒 */
        });
    }, null, true, 'Asia/Shanghai');

    return function *(next) {yield next;}
}
