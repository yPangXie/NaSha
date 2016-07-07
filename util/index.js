"use strict";

module.exports.log = require('./log');
module.exports.leanCloud = require('./leancloud');
module.exports.decodeData = (data) => {
    try {
        return decodeURIComponent(data);
    } catch(e) {
        return data;
    }
}

/* 获取IP地址 */
module.exports.getIP = (ctx) => {
    try {
        return ctx.req.headers['x-forwarded-for'] ||
               ctx.req.connection.remoteAddress ||
               ctx.req.socket.remoteAddress ||
               ctx.req.connection.socket.remoteAddress;
    } catch(e) {
        return '';
    }
}

/* 获取昨天的日期 */
module.exports.getYesterday = (date) => {
    let today = date ? new Date(date) : new Date();
    let todayTimestamp = today.valueOf();
    let yesterdayTimestamp = todayTimestamp - 24 * 60 * 60 * 1000;
    return  new Date(yesterdayTimestamp);
}
