"use strict"

/* 暴露的定时方法 */
module.exports.cmd = {
    /* 每天的报告 */
    "daily": require('./cmd/daily'),
    /* 距离目标日期还有多少天 */
    "countDown": require('./cmd/count-down')
}
