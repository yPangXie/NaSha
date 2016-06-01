"use strict"

const cheerio = require('cheerio');
const urllib = require('urllib');
const request = require('co-request');
const util = require('../../util');
const urlConfig = {
    "prefix": "https://wanqu.co",
    "latest": "https://wanqu.co/issues",
    "specific": "https://wanqu.co/issues/{issue}?s=/issues"
};

/* 获取最新一期的内容 */
module.exports.getLatest = function *() {
    let latestPageData = yield request(urlConfig.latest, {"method": "GET"});
    if(!latestPageData) return {'success': false};

    let $ = cheerio.load(latestPageData.body, {normalizeWhitespace: true});

    let title = $('.more-link').first().find('a').text();
    let list = [];
    $('.list-group').first().find('.list-group-item').each(function() {
        let item = $(this).find('.list-title a');
        let originWrap = $(this).find('.aux-info-text a');
        list.push({
            "link": urlConfig.prefix + item.attr('href'),
            "oriLink": originWrap.attr('href'),
            "title": item.text(),
            "summay": urlConfig.prefix + item.attr('href')
        });
    });

    return this.body = {
        "success": true,
        "data": {
            "title": title,
            "list": list
        }
    };
}

/* 获取指定某一期 */
module.exports.getSpec = function *(body) {
    if(!body || !body.issue) return {"success": false};

    let specPageData = yield request(urlConfig.specific.replace('{issue}', body['issue']), {"method": "GET"});
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
                "link": urlConfig.prefix + item.attr('href'),
                "oriLink": originWrap.find('a').attr('href'),
                "title": item.text(),
                "summay": $(this).find('.summary-text').text().trim()
            });
        }
    });

    return this.body = {
        "success": true,
        "data": {
            "title": title.replace(' · ', ''),
            "list": list
        }
    };
}
