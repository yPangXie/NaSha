"use strict"

const urllib = require('urllib');

module.exports = function *() {
    console.log(this.state.config.weibo.app_key);
    return yield this.render('/weibo/home', {
        token: this.session.weibo.token || "",
        appKey: this.state.config.weibo.app_key,
        redirectURI: this.state.config.weibo.redirect_uri
    });
}
