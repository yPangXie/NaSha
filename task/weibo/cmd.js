"use strict"

const urllib = require('urllib');
const fs = require('co-fs-extra');

/* 发送微薄 */
module.exports.autoNotice = function *() {
    let token = yield fs.readFile('./tmp/token', 'utf-8');
    try {
        token = JSON.parse(new Buffer(data).toString());
    } catch(e) {
        console.log(`[${new Date()}] JSON parse token data from file failed ${e}`)
    };

    if(token.access_token) {
        let userids = yield getUserInfo(['1835626681'], this.session.weibo.token);
        let sendMessage = yield urllib.request('https://api.weibo.com/2/statuses/update.json', {
            "method": "POST",
            "data": {
                "access_token": token.access_token,
                "status": this.query.message || `${userids.map(item => `@${item} `)} 分歧者3, 五星不推荐..? -From NaSha`
            }
        });

        console.log(new Buffer(sendMessage.data).toString());
    }
}

/* 根据用户id获取昵称 */
function *getUserInfo (userids, token) {
    let userScreennames = [];
    for(let i = 0, len = userids.length; i < len; i++) {
        let user = yield urllib.request('https://api.weibo.com/2/users/show.json', {
            "method": "GET",
            "data": {
                "access_token": token.access_token,
                "uid": userids[i]
            }
        });

        userScreennames.push(JSON.parse(new Buffer(user.data).toString()).screen_name);
    }

    return userScreennames;
}
