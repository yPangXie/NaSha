"use strict"

const urllib = require('urllib');
const fs = require('co-fs-extra');
const util = require('../util');

/* 发送微薄 */
module.exports.sendMessage = async (body = {}, ctx) => {
    let token = {};
    try {
        let tokenBuf = await fs.readFile(`${__dirname}/tmp/token`, 'utf-8');
        token = JSON.parse(new Buffer(tokenBuf).toString());
    } catch(e) {
        util.log.default(`[${new Date()}] JSON parse token data from file failed ${e}`);
        return ctx.body = {"success": false, "message": "Token is invalid"};
    };

    if(!token.access_token || isTokenExpired(token)) {
        util.log.default('Token is invalid or expired');
        return ctx.body = {"success": "false", "message": "Token is invalid or expired"};
    }

    let userids = await getUserInfo([/*'1783727097', */'1835626681'], token.access_token);

    let sendMessage = await request('https://api.weibo.com/2/statuses/update.json', {
        "method": "POST",
        "data": {
            "access_token": token.access_token,
            "status": `${body.message || '这是一条来自NaSha的信息'} ${userids.map(item => `@${item} `)}`
        }
    });

    return ctx.body = {"success": true};
}

/* 检测token是否过期 */
function isTokenExpired(token = {}) {
    let expiresIn = token.expires_in;
    let authTime = token.auth_time;
    let now = Date.now();

    return (!expiresIn || !authTime || now - expiresIn >= authTime) ? true : false;
}

/* 根据用户id获取昵称 */
async function getUserInfo (userids = [], token = '') {
    let userScreennames = [];
    for(let i = 0, len = userids.length; i < len; i++) {
        let user = await request('https://api.weibo.com/2/users/show.json', {
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
