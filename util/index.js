"use strict";

const urllib = require('urllib');
const baiduApi = require('../.config').baiduip;

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
module.exports.getIP = function *(ctx){
    try {
        let ipRaw = ctx.req.headers['x-forwarded-for'] ||
               ctx.req.connection.remoteAddress ||
               ctx.req.socket.remoteAddress ||
               ctx.req.connection.socket.remoteAddress;

        let ip = ipRaw.match(/[\d\.].*/)[0] || '';
        if(!ip) return '';

        /* 获取ip的地址信息, 用了baidu的API. 大阿里的qps限制10... */
        let ipInformationBuffer = yield urllib.requestThunk(`http://apis.baidu.com/apistore/iplookupservice/iplookup?ip=${ip}`, {
            "headers": {
                "apikey": baiduApi.apikey
            }
        });

        let ipInformation = JSON.parse(new Buffer(ipInformationBuffer.data).toString());
        return ipInformation && ipInformation.errNum == 0 ? ipInformation.retData : {};
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
