"use strict";

const ua = require('user-agent-parser');
const urllib = require('urllib');
const baiduApi = require('../.config').baiduip;

module.exports.leanCloud = require('./leancloud');

module.exports.log = {
    /* 默认日志. 最简单那种 */
    "default": (message, type) => {
        let logType = type || 'warn';
        let timestampData = timestamp();
        console.log(`[${timestampData}] ${logType} - ${message}`);
    },
    /* 记录操作执行时间(目前只支持generator) */
    "debugExecDuration": function *(message, callback) {
        let startTime = new Date();
        let callbackResult = yield callback();
        console.log(`[${timestamp()}]${message}: ${new Date() - startTime}ms`);

        return callbackResult;
    }
}

/* decode字符串 */
module.exports.decodeData = (data) => {
    try {
        return decodeURIComponent(data);
    } catch(e) {
        return data;
    }
}

/* 获取IP地址 */
module.exports.getIP = function *(ctx){
    try {
        let ua = ctx.req.headers['user-agent'] || '';
        let ipRaw = ctx.req.headers['x-forwarded-for'] ||
               ctx.req.connection.remoteAddress ||
               ctx.req.socket.remoteAddress ||
               ctx.req.connection.socket.remoteAddress;

        let ip = ipRaw.match(/[\d\.].*/)[0] || '';
        if(!ip) return '';

        /* 获取ip的地址信息, 用了baidu的API. 大阿里的qps限制10... */
        // let ipInformationBuffer = yield urllib.requestThunk(`http://apis.baidu.com/apistore/iplookupservice/iplookup?ip=${ip}`, {
        //     "headers": {
        //         "apikey": baiduApi.apikey
        //     }
        // });

        /* 每天限制1000个请求. 先看效果 */
        let ipDataBuffer = yield urllib.requestThunk(`http://freeapi.ipip.net/${ip}`);
        let ipDataRetString = new Buffer(ipDataBuffer.data).toString();
        let ipDataRetObject = JSON.parse(ipDataRetString.replace(/(,""|,\s""|,''|,\s'')/g, ''));
        
        return  ipDataRetObject ? {"ip": ip, "info": ipDataRetObject.join('/'), "ua": ua} :  {"ip": ip, "ua": ua};
    } catch(e) {
        console.log(`Get ip error:`, e);
        return '';
    }
}

/* 获取昨天的日期 */
module.exports.getYesterday = (date) => {
    let today = date ? new Date(date) : new Date();
    let todayTimestamp = today.valueOf();
    let yesterdayTimestamp = todayTimestamp - 24 * 60 * 60 * 1000;
    return new Date(yesterdayTimestamp);
}

/* 生成时间戳 */
function timestamp() {
    let time = new Date();
    let year = time.getFullYear();
    let month = ('0' + (time.getMonth() + 1)).slice(-2);
    let day = ('0' + time.getDate()).slice(-2);
    let hour = ('0' + time.getHours()).slice(-2);
    let minute = ('0' + time.getMinutes()).slice(-2);
    let second = ('0' + time.getSeconds()).slice(-2);

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}
