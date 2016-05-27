"use strict"

const urllib = require('urllib');
const fs = require('co-fs-extra');

/* 发送微薄 */
module.exports.sendMessage = function *(body) {
    let bodyObject = body || {};
    let token = {};
    try {
        let tokenBuf = yield fs.readFile(`${__dirname}/tmp/token`, 'utf-8');
        token = JSON.parse(new Buffer(tokenBuf).toString());
    } catch(e) {
        console.log(`[${new Date()}] JSON parse token data from file failed ${e}`);
        return this.body = {"success": false, "message": "Token is invalid"};
    };

    if(!token.access_token || isTokenExpired(token)) {
        console.log('Token is invalid or expired');
        return this.body = {"success": "false", "message": "Token is invalid or expired"};
    }

    let userids = yield getUserInfo([/*'1783727097', */'1835626681'], token.access_token);

    let sendMessage = yield urllib.request('https://api.weibo.com/2/statuses/update.json', {
        "method": "POST",
        "data": {
            "access_token": token.access_token,
            "status": `${bodyObject.message || '这是一条来自NaSha的信息'} ${userids.map(item => `@${item} `)}`
        }
    });

    return this.body = {"success": true};
}

/* 检测token是否过期 */
function isTokenExpired(token) {
    let expiresIn = token.expires_in;
    let authTime = token.auth_time;
    let now = Date.now();

    return (!expiresIn || !authTime || now - expiresIn >= authTime) ? true : false;
}

/* 根据用户id获取昵称 */
function *getUserInfo (userids, token) {
    let userScreennames = [];
    for(let i = 0, len = userids.length; i < len; i++) {
        let user = yield urllib.request('https://api.weibo.com/2/users/show.json', {
            "method": "GET",
            "data": {
                "access_token": token,
                "uid": userids[i]
            }
        });

        userScreennames.push(JSON.parse(new Buffer(user.data).toString()).screen_name);
    }

    return userScreennames;
}
