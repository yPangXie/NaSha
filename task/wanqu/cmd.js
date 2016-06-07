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
    let season = $('.more-link').first().find('a').attr('title').match(/\d+/)[0];
    let list = [];
    $('.list-group').first().find('.list-group-item').each(function() {
        let item = $(this).find('.list-title a');
        let originWrap = $(this).find('.aux-info-text a');
        list.push({
            "link": decodeData(urlConfig.prefix + item.attr('href')),
            "oriLink": decodeData(originWrap.attr('href')),
            "title": decodeData(item.text()),
            "summary": decodeData(urlConfig.prefix + item.attr('href'))
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

    /* 先判断DB中是否有缓存 */
    let cacheData = yield util.leancloud.getArticle(body.issue);
    if(cacheData && cacheData.length) {
        let list = [];
        cacheData.forEach(item => {
            list.push({
                "link": item.get('link') || '',
                "oriLink": item.get('ori_link') || '',
                "title": item.get('title') || '',
                "summary": item.get('summary') || ''
            });
        });

        return this.body = {
            "success": true,
            "data": {
                "title": `[${cacheData[0].get('create_date')} 第${cacheData[0].get('season')}期]`,
                "list": list
            }
        };
    }

    /* 未获取到缓存数据, 爬取页面 */
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
                "link": decodeData(urlConfig.prefix + item.attr('href')),
                "oriLink": decodeData(originWrap.find('a').attr('href')),
                "title": decodeData(item.text()),
                "summary": decodeData($(this).find('.summary-text').text().trim())
            });
        }
    });

    /* 将爬取的数据存到数据库(不关心成功与否) */
    let createDate = title.split(' ')[0];
    let season = title.split(' ')[1].match(/\d/g);
    for(let i = 0, len = list.length; i < len; i++) {
        let item = list[i];
        yield util.leancloud.addArticle({
            "create_date": createDate,
            "season": season[0],
            "ori_link": decodeData(item.oriLink),
            "title": decodeData(item.title || ''),
            "summary": decodeData(item.summary || ''),
            "link": decodeData(item.link || '')
        });
    }

    /* 返回页面爬去的结果 */
    return this.body = {
        "success": true,
        "data": {
            "title": title.replace(' · ', ''),
            "list": list
        }
    };
}

/* 解码数据, 避免数据渲染异常 */
function decodeData(data) {
    try {
        return decodeURIComponent(data);
    } catch(e) {
        return data;
    }
}
