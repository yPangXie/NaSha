"use strict"

module.exports = function *() {
    return yield this.render('/home/home', {
        token: this.session.weibo.token || "",
        appKey: this.state.config.weibo.app_key,
        redirectURI: this.state.config.weibo.redirect_uri
    });
}
