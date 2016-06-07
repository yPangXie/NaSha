"use strict";

const AV = require('avoscloud-sdk');
const leanCloudSecret = require('./.secret');
AV.initialize(leanCloudSecret.appId, leanCloudSecret.appKey);

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

/* 根据期数, 搜索指定的数据 */
module.exports.getArticle = function *(id) {
    let articleQuery = new AV.Query("Wanqu");
    articleQuery.equalTo("season", id);

    return articleQuery.find();
}
