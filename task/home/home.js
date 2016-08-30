"use strict"

const util = require('../../util');
const limit = 20;

module.exports = function *() {
    let query = this.query || {};
    let searchWords = query.words || '';
    let page = +query.page || 1;

    let object = {
        "readList": [],
        "count": 0,
        "today": [],
        "old": []
    };

    let todayDateString = new Date().toLocaleDateString();
    if(searchWords) {
        object.readList = yield util.leanCloud.read.searchByWords({
            "words": searchWords,
            "limit": limit,
            "offset": (page - 1) * limit
        });
        object.count = object.readList.length;
    } else {
        object.count = yield util.leanCloud.read.count();
        object.readList = yield util.leanCloud.read.list({
            "limit": limit,
            "offset": (page - 1) * limit
        });
    }

    object.readList.forEach(item => {
        let createdAt = new Date(item.createdAt);
        let createdDateString = createdAt.toLocaleDateString();
        let title = item.get('title') || '';
        let description = item.get('description') || '';

        item.createdAt = `${createdDateString} ${createdAt.toLocaleTimeString()}`;
        /* 搜索结果高亮关键字 */
        if(searchWords) {
            if(title) item.set('title', title.replace(searchWords, `<span class="search-highlight">${searchWords}</span>`));
            if(description) item.set('description',description.replace(searchWords, `<span class="search-highlight">${searchWords}</span>`));
        }
        if(createdDateString == todayDateString) object.today.push(item);
        else object.old.push(item);
    });

    return yield this.render('/home/home', {
        "words": searchWords,
        "today": object.today,
        "old": object.old,
        "todayCount": object.today.length > 0 ? true : false,
        "current": page,
        "pages": Array.from({"length": Math.ceil(object.count / limit)}, (v, k) => k + 1)
    });
    // return yield this.render('/home/home', {
    //     token: this.session.weibo.token || "",
    //     appKey: this.state.config.weibo.app_key,
    //     redirectURI: this.state.config.weibo.redirect_uri
    // });
}
