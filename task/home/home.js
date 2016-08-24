"use strict"

const util = require('../../util');

module.exports = function *() {
    let readList = yield util.leanCloud.read.list({
        "limit": 100,
        "offset": 0
    });
    
    let todayDateString = new Date().toLocaleDateString();
    let todayList = [];
    let oldList = [];
    readList.forEach(item => {
        let createdAt = new Date(item.createdAt);
        let createdDateString = createdAt.toLocaleDateString();
        item.createdAt = `${createdDateString} ${createdAt.toLocaleTimeString()}`;

        if(createdDateString == todayDateString) todayList.push(item);
        else oldList.push(item);
    });

    return yield this.render('/home/home', {
        "today": todayList,
        "old": oldList,
        "todayCount": todayList.length > 0 ? true : false
    });
    // return yield this.render('/home/home', {
    //     token: this.session.weibo.token || "",
    //     appKey: this.state.config.weibo.app_key,
    //     redirectURI: this.state.config.weibo.redirect_uri
    // });
}
