"use strict"

const cheerio = require('cheerio');
const request = require('co-request');
const util = require('../../../util');
const url = "https://wanqu.co/issues?s=top";

/* 检测是否有最新一期的wanqu日报发布 */
module.exports = function *(ctx) {
    /* 未获取到缓存数据, 爬取页面 */
    let specPageData = yield request(url, {"method": "GET"});
    if(!specPageData || !specPageData.body) return {'success': false};

    let $ = cheerio.load(specPageData.body, {normalizeWhitespace: true});
    let title = $('.list-header').first().text().trim().split(' ')[1];
    let issue = title.match(/\d+/g)[0];

    /* 获取当前Wanqu日报最新版的版本号 */
    let latestVersionData = yield util.leanCloud.getLatestIssueVersion();
    let latestVersion = latestVersionData && latestVersionData.get('latestIssue');

    /* 当前最新版高于DB中存储的最新版, 或者DB中特么压根没存数据的时候. 抓最新版的数据 */
    if((!latestVersion && issue) || (latestVersion && issue && +issue < +latestVersion)) {
        yield util.leanCloud.storeLatestIssueVersion(issue);
        return {
            "success": true,
            "issue": issue
        };
    }

    return {
        "success": false
    };
}
