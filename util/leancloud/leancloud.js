"use strict";

const AV = require('avoscloud-sdk');
const leanCloudSecret = require('./.secret');
AV.initialize(leanCloudSecret.appId, leanCloudSecret.appKey);

const Article = AV.Object.extend('Wanqu');
const Workflows = AV.Object.extend('Workflows');

/* 添加湾区指定某期的数据 */
module.exports.addArticle = function *(options) {
    let articleObject = new Article();

    for(let key in options) {
        articleObject.set(key, options[key]);
    }

    articleObject.save();
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

/* 添加workflow */
module.exports.addWorkflow = function *(options) {

    let WorkflowsObject = new Workflows();

    for(let key in options) {
        WorkflowsObject.set(key, options[key]);
    }

    WorkflowsObject.save();
}
