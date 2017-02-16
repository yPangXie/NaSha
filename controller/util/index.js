"use strict";

const baiduApi = require(`${global.__nasha.APP_ROOT}/.config`).baiduip;
/* 目前使用一个奇葩的做法. 判断`ip`来源的请求, 交替着从`baidu`和`ipip.net`获取. 主要是受限于接口的QPS */
let ipServiceFlag = 'baidu';

module.exports.log = {
    /* 默认日志. 最简单那种 */
    "default": (message = '', type = 'warn') => {
        let timestampData = timestamp();
        console.log(`[${timestampData}] ${type} - ${message}`);
    },
    /* 记录操作执行时间(目前只支持generator) */
    "debugExecDuration": async (message = '', callback) => {
        let startTime = new Date();
        let callbackResult = await callback();
        console.log(`[${timestamp()}]${message}: ${new Date() - startTime}ms`);

        return callbackResult;
    }
}

/* decode字符串 */
module.exports.decodeData = (data = '') => {
    try {
        return decodeURIComponent(data);
    } catch(e) {
        return data;
    }
}

/* 获取IP地址 */
module.exports.getIP = async ctx => {
    try {
        let ua = ctx.req.headers['user-agent'] || '';
        let ipRaw = ctx.req.headers['x-forwarded-for'] ||
                    ctx.req.connection.remoteAddress ||
                    ctx.req.socket.remoteAddress ||
                    ctx.req.connection.socket.remoteAddress;

        let ip = ipRaw.match(/[\d\.].*/)[0] || '';
        if(!ip) return '';
        if(ip == '127.0.0.1') return {"ip": ip, "info": "本机地址", "ua": ua};

        /* 返回值 */
        let retObject = {};
        /* 轮流调用两个接口 */
        if(ipServiceFlag == 'baidu') {
            ipServiceFlag = 'ipip';
            /* 获取ip的地址信息, 用了baidu的API. 大阿里的qps限制10... */
            let ipInformationBuffer = await request(`http://apis.baidu.com/apistore/iplookupservice/iplookup?ip=${ip}`, {
                "headers": {"apikey": baiduApi.apikey}
            });
            let ipDataRetObjectBaidu = JSON.parse(new Buffer(ipInformationBuffer.body).toString());
            if(ipDataRetObjectBaidu && ipDataRetObjectBaidu.errNum == 0) {
                let ret = ipDataRetObjectBaidu.retData || {};
                retObject = {
                    "ip": ip,
                    "info": `${ret.country || ''}/${ret.province || ''}/${ret.city || ''}/${ret.district || ''}/${ret.carrier || ''}`,
                    "ua": ua
                }
            } else {
                retObject = {"ip": ip, "ua": ua};
            }

        } else {
            ipServiceFlag = 'baidu';
            /* 每天限制1000个请求. 先看效果 */
            let ipDataBufferIPIP = await request(`http://freeapi.ipip.net/${ip}`);
            let ipDataRetStringIPIP = new Buffer(ipDataBufferIPIP.body).toString();
            let ipDataRetObjectIPIP = JSON.parse(ipDataRetStringIPIP.replace(/(,""|,\s""|,''|,\s'')/g, ''));
            retObject = ipDataRetObjectIPIP ? {"ip": ip, "info": ipDataRetObjectIPIP.join('/'), "ua": ua} :  {"ip": ip, "ua": ua};
        }

        return retObject;
    } catch(e) {
        console.log(`Get ip error:`, e);
        return '';
    }
}

/* 获取昨天的日期 */
module.exports.getYesterday = (date = null) => {
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

/* 将`LeanCloud`的数据对象转换为普通的对象 */
module.exports.convertObject = (data = []) => {
    let ret = [];
    data.forEach(item => {
        if(!item.attributes) return true;
        let temp = item.attributes;

        temp.id = item.id;
        temp.createdAt = item.createdAt;
        temp.updatedAt = item.updatedAt;

        ret.push(temp);
    });

    return ret;
}
