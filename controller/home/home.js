"use strict"

const timeago = require("timeago.js")();
const model = require('../../model');
const util = require('../util');
const limit = 20;

module.exports = function *() {
    let query = this.query || {};
    let searchWords = query.words || '';
    let date = query.date || '';
    let page = +query.page || 1;

    let object = {
        "readList": [],
        "count": 0,
        "today": [],
        "old": []
    };

    let todayDateString = new Date().toLocaleDateString();
    if(searchWords || date) {
        let readList = yield model.leanCloud.read.filter({
            "words": searchWords,
            "date": date,
            "limit": limit,
            "offset": (page - 1) * limit
        });
        object.readList = util.convertObject(readList);
        object.count = object.readList.length;
    } else {
        let debugStartDate = new Date();
        let readData = {};
        /* 先拿缓存数据 */
        let cacheReadList = global.__nasha.APP_CACHE.get('readList');
        if(cacheReadList) {
            /* 命中缓存, 直接返回 */
            readData = JSON.parse(cacheReadList);
        } else {
            /* 未命中缓存, 则从`DB`取数据, 并且更新到缓存中 */
            readData = yield {
                "count": model.leanCloud.read.count(),
                "readList": model.leanCloud.read.list({
                    "limit": limit,
                    "offset": (page - 1) * limit
                })
            };

            readData.readList = util.convertObject(readData.readList);
            global.__nasha.APP_CACHE.put('readList', JSON.stringify(readData));
        }
        
        console.log(`Get count and list of read list spend ${new Date() - debugStartDate} ms.`);
        object.count = readData.count;
        object.readList = readData.readList;
    }

    object.readList.forEach(item => {
        let createdAt = new Date(item.createdAt);
        let createdDateString = createdAt.toLocaleDateString();
        let title = item.title || '';
        let description = item.description || '';

        item.createdAt = `${createdDateString} ${createdAt.toLocaleTimeString()}`;
        /* 搜索结果高亮关键字 */
        if(searchWords) {
            if(title) item.title = title.replace(searchWords, `<span class="search-highlight">${searchWords}</span>`);
            if(description) item.description = description.replace(searchWords, `<span class="search-highlight">${searchWords}</span>`);
        }
        if(createdDateString == todayDateString) {
            item.magicCreatedAt = timeago.format(item.createdAt);
            object.today.push(item);
        } else {
            object.old.push(item);
        }
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
