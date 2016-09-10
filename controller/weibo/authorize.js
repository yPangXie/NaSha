"use strict"

const urllib = require('urllib');
const fs = require('fs');
const util = require('../util');

module.exports = function *() {
    const getAccessToken = `https://api.weibo.com/oauth2/access_token?client_id=${this.state.config.weibo.app_key}&client_secret=${this.state.config.weibo.app_secret}&grant_type=authorization_code&redirect_uri=${this.state.config.weibo.redirect_uri}&code=${this.query.code}`;
    let response = yield urllib.request(getAccessToken, {"method": "POST"});
    try {
        let dataObject = JSON.parse(new Buffer(response.data).toString());
        dataObject.auth_time = Date.now();
        fs.writeFile(`${__dirname}/tmp/token`, JSON.stringify(dataObject), function(err) {
            if (err) util.log.default(`[${new Date()}] write token failed. ${err}`);
        });
        this.session.weibo.token = dataObject;

        util.log.default(this.session.weibo.token);
    } catch(e) {}

    return this.redirect(`${this.state.config.routerPrefix}/weibo`);
}
