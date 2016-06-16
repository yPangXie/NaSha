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
    let latestIssue = title.match(/\d+/g)[0];

    /* 获取当前Wanqu日报最新版的版本号 */
    let currentLatestIssue = yield util.leanCloud.getCurrentLatestIssue();
    let currentIssue = currentLatestIssue && currentLatestIssue.get('latestIssue');

    /* 当前最新版高于DB中存储的最新版, 或者DB中特么压根没存数据的时候. 抓最新版的数据 */
    if((!currentIssue && latestIssue) || (currentIssue && latestIssue && +latestIssue > +currentIssue)) {
        yield util.leanCloud.storeLatestIssueVersion(latestIssue);
        return {
            "success": true,
            "issue": latestIssue
        };
    }

    return {
        "success": false
    };
}
