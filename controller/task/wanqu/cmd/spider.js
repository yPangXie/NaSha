"use strict"

const cheerio = require('cheerio');
const request = require('co-request');
const util = require(`${global.__nasha.APP_CONTROLLER}/util`);
const model = require(global.__nasha.APP_MODEL);
const urlConfig = {
    "topUrl": "https://wanqu.co/issues?s=top",
    "prefix": "https://wanqu.co",
    "specific": "https://wanqu.co/issues/{issue}?s=/issues"
};

/* 根据id或自动判断, 爬去对应页面的数据 */
module.exports = function *(body, ctx) {
    let issueList = "";
    if(body && body.issue) {
         issueList = body.issue;
    } else {
        let hasLatest = yield module.exports.detectLatest();
        if(!hasLatest.success) return "False: no need to get latest."
        issueList = hasLatest.issue;
    }

    /* 未获取到缓存数据, 爬取页面 */
    let issues = issueList.replace(/\s/g, '').split(',');
    for(let issueIndex = 0, issuesLength = issues.length; issueIndex < issuesLength; issueIndex++) {
        let specificURL = urlConfig.specific;
        let issue = issues[issueIndex];

        let specPageData = yield request(specificURL.replace('{issue}', issue), {"method": "GET"});
        if(!specPageData || !specPageData.body) return {'success': false};

        let $ = cheerio.load(specPageData.body, {normalizeWhitespace: true});
        $('.list-header a').remove();
        let title = $('.list-header').text();
        let list = [];
        $('.list-group').first().find('.list-group-item').each(function() {
            let item = $(this).find('.list-title a');
            let originWrap = $(this).find('.row').first();

            if(item.length) {
                list.push({
                    "link": util.decodeData(urlConfig.prefix + item.attr('href')),
                    "oriLink": util.decodeData(originWrap.find('a').attr('href')),
                    "title": util.decodeData(item.text()),
                    "summary": util.decodeData($(this).find('.summary-text').text().trim())
                });
            }
        });
        if(!list.length || !title) return {"success": false, "message": "Wanqu日报数据抓取失败.. 可能是页面结构变了, 或者.. 还真是没数据."};

        /* 将爬取的数据存到数据库(不关心成功与否) */
        let createDate = title.split(' ')[0];
        let season = title.split(' ')[1].match(/\d+/g);
        for(let i = 0, len = list.length; i < len; i++) {
            let item = list[i];
            yield model.leanCloud.wanqu.store({
                "create_date": createDate,
                "season": season[0],
                "ori_link": util.decodeData(item.oriLink),
                "title": util.decodeData(item.title || ''),
                "summary": util.decodeData(item.summary || ''),
                "link": util.decodeData(item.link || '')
            });
        }
    }

    yield model.leanCloud.helper.applog(`Wanqu - 也许成功的抓取了第${issueList}期的数据..`);
    return `True: ${issueList}`
}

/* 检测是否有最新一期的wanqu日报发布 */
module.exports.detectLatest = function *(ctx) {
    /* 未获取到缓存数据, 爬取页面 */
    let specPageData = yield request(urlConfig.topUrl, {"method": "GET"});
    if(!specPageData || !specPageData.body) return {'success': false};

    let $ = cheerio.load(specPageData.body, {normalizeWhitespace: true});
    let title = $('.list-header').first().text().trim().split(' ')[1];
    let latestIssue = title.match(/\d+/g)[0];

    /* 获取当前Wanqu日报最新版的版本号 */
    let currentLatestIssue = yield model.leanCloud.wanqu.getCurrentLatestIssue();
    let currentIssue = currentLatestIssue && currentLatestIssue.get('latestIssue');

    /* 当前最新版高于DB中存储的最新版, 或者DB中特么压根没存数据的时候. 抓最新版的数据 */
    if((!currentIssue && latestIssue) || (currentIssue && latestIssue && +latestIssue > +currentIssue)) {
        yield model.leanCloud.wanqu.storeLatestIssueVersion(latestIssue);
        return {
            "success": true,
            "issue": latestIssue
        };
    }

    return {
        "success": false
    };
}
