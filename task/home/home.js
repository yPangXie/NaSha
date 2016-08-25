"use strict"

const util = require('../../util');
const limit = 20;

module.exports = function *() {
    let query = this.query || {};
    let page = +query.page || 1;
    let count = yield util.leanCloud.read.count();
    
    let readList = yield util.leanCloud.read.list({
        "limit": limit,
        "offset": (page - 1) * limit
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
        "todayCount": todayList.length > 0 ? true : false,
        "current": page,
        "pages": Array.from({"length": Math.ceil(count / limit)}, (v, k) => k + 1)
    });
    // return yield this.render('/home/home', {
    //     token: this.session.weibo.token || "",
    //     appKey: this.state.config.weibo.app_key,
    //     redirectURI: this.state.config.weibo.redirect_uri
    // });
}
