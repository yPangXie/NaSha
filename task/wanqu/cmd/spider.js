"use strict"

const cheerio = require('cheerio');
const request = require('co-request');
const util = require('../../../util');
const urlConfig = {
    "prefix": "https://wanqu.co",
    "specific": "https://wanqu.co/issues/{issue}?s=/issues"
};

/* 根据id, 爬去对应页面的数据 */
module.exports = function *(body, ctx) {
    if(!body || !body.issue) return {"success": false, "message": "参数错误, 你特么是不是没传id"};

    /* 未获取到缓存数据, 爬取页面 */
    let issues = body.issue.replace(/\s/g, '').split(',');
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
            yield util.leanCloud.addWanqu({
                "create_date": createDate,
                "season": season[0],
                "ori_link": util.decodeData(item.oriLink),
                "title": util.decodeData(item.title || ''),
                "summary": util.decodeData(item.summary || ''),
                "link": util.decodeData(item.link || '')
            });
        }
    }

    return {"success": true, "message": `也许成功的抓取了第${body.issue}期的数据..`};
}
