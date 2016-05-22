"use strict"

const urllib = require('urllib');
const fs = require('fs');

module.exports = function *() {
    const getAccessToken = `https://api.weibo.com/oauth2/access_token?client_id=${this.state.config.weibo.app_key}&client_secret=${this.state.config.weibo.app_secret}&grant_type=authorization_code&redirect_uri=${this.state.config.weibo.redirect_uri}&code=${this.query.code}`;
    let response = yield urllib.request(getAccessToken, {"method": "POST"});
    try {
        let dataString = new Buffer(response.data).toString();
        fs.writeFile(`${__dirname}/tmp/token`, dataString, function(err) {
            if (err) console.log(`[${new Date()}] write token failed. ${err}`);
        });
        this.session.weibo.token = JSON.parse(dataString);
    } catch(e) {}

    return this.redirect('/weibo');
}
