"use strict"

const util = require('../../util');

module.exports = function *() {
    let readList = yield util.leanCloud.read.list({
        "limit": 100,
        "offset": 0
    });
    
    readList.forEach(item => {
        let createdAt = new Date(item.createdAt);
        item.createdAt = `${createdAt.toLocaleDateString()} ${createdAt.toLocaleTimeString()}`;
    });

    return yield this.render('/home/home', {
        "list": readList
    });
    // return yield this.render('/home/home', {
    //     token: this.session.weibo.token || "",
    //     appKey: this.state.config.weibo.app_key,
    //     redirectURI: this.state.config.weibo.redirect_uri
    // });
}
