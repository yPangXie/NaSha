"use strict"

/* 暴露cmd方法 */
module.exports.cmd = {}

/* 暴露的定时方法 */
module.exports.timing = {
    "countDown": require('./timing/count-down')
}
