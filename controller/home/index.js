"use strict"

const timeago = require("timeago.js")();
const model = require('../../model');
const util = require('../util');
const limit = 20;

module.exports = async (ctx, next) => {
    let query = ctx.query || {};
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
        let readList = await model.leanCloud.read.filter({
            "words": searchWords,
            "date": date,
            "limit": limit,
            "offset": (page - 1) * limit
        });
        object.readList = util.convertObject(readList);
        object.count = object.readList.length;
    } else {
        let readData = {};
        /* 先拿缓存数据 */
        let cacheReadList = global.__nasha.APP_CACHE.get('readList');
        if(cacheReadList && page == 1) {
            /* 命中缓存, 直接返回 */
            readData = JSON.parse(cacheReadList);
        } else {
            /* 未命中缓存, 则从`DB`取数据, 并且更新到缓存中 */
            readData = {
                "count": await model.leanCloud.read.count(),
                "readList": await model.leanCloud.read.list({
                    "limit": limit,
                    "offset": (page - 1) * limit
                })
            };

            readData.readList = util.convertObject(readData.readList);
            if(page == 1) global.__nasha.APP_CACHE.put('readList', JSON.stringify(readData));
        }

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

    ctx.set({
        'X-Frame-Options': 'deny',
        'x-content-type-options': 'nosniff'
    });

    return await ctx.render('home/home', {
        "words": searchWords,
        "today": object.today,
        "old": object.old,
        "todayCount": object.today.length > 0 ? true : false,
        "current": page,
        "pages": Array.from({"length": Math.ceil(object.count / limit)}, (v, k) => k + 1)
    });
    // return await ctx.render('/home/home', {
    //     token: ctx.session.weibo.token || "",
    //     appKey: ctx.state.config.weibo.app_key,
    //     redirectURI: ctx.state.config.weibo.redirect_uri
    // });
}
