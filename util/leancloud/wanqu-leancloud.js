"use strict";

const AV = require('avoscloud-sdk');
const leanCloudSecret = require('./.secret');
AV.initialize(leanCloudSecret.wanqu.appId, leanCloudSecret.wanqu.appKey);

/* 添加湾区指定某期的数据 */
module.exports.addArticle = function *(options) {
    let article = AV.Object.extend('Wanqu');
    let articleObject = new article();

    for(let key in options) {
        articleObject.set(key, options[key]);
    }

    articleObject.save().then(function () {}, function(err) {
        console.log(err);
    });
}

/* 获取最新一期的数据 */
module.exports.getLatestArticle = function *() {
    let articleQuery = new AV.Query("Wanqu");
    articleQuery.descending('createdAt');

    let latestSeasonData = yield articleQuery.first();
    let season = latestSeasonData.get('season');

    let latestArticleQuery = new AV.Query('Wanqu');
    latestArticleQuery.equalTo("season", season);

    return latestArticleQuery.find();
}

/* 根据期数, 搜索指定的数据 */
module.exports.getSpecArticle = function *(id) {
    let articleQuery = new AV.Query("Wanqu");
    articleQuery.equalTo("season", id);

    return articleQuery.find();
}
