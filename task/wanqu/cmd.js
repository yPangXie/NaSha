"use strict"

const cheerio = require('cheerio');
const urllib = require('urllib');
const request = require('co-request');
const util = require('../../util');
const urlConfig = {
    "prefix": "https://wanqu.co",
    "specific": "https://wanqu.co/issues/{issue}?s=/issues"
};

/* 获取最新一期的内容 */
module.exports.getLatest = function *() {
    /* 先判断DB中是否有缓存 */
    let dbData = yield util.leanCloud.getLatestArticle();
    return generateResponse(dbData);
}

/* 获取指定某一期 */
module.exports.getSpec = function *(body) {
    if(!body || !body.issue) return {"success": false};
    /* 先判断DB中是否有缓存 */
    let dbData = yield util.leanCloud.getSpecArticle(body.issue);
    return generateResponse(dbData);
}

/* 格式化返回值 */
function generateResponse (data) {
    let resultData = data || [];
    let responseData = {
        "success": false,
        "data": {
            "title": '',
            "list": []
        }
    }

    if(resultData.length) {
        responseData.success = true;
        responseData.data.title = `${resultData[0].get('create_date')} 第${resultData[0].get('season')}期`;
        resultData.forEach(item => {
            responseData.data.list.push({
                "link": item.get('link') || '',
                "oriLink": item.get('ori_link') || '',
                "title": item.get('title') || '',
                "summary": item.get('summary') || ''
            });
        });
    }

    return responseData;
}

/* 根据id, 爬去对应页面的数据 */
module.exports.spider = function *(body) {
    if(!body || !body.issue) return {"success": false, "message": "参数错误, 你特么是不是没传id"};

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
    let season = title.split(' ')[1].match(/\d+/g);
    for(let i = 0, len = list.length; i < len; i++) {
        let item = list[i];
        yield util.leanCloud.addArticle({
            "create_date": createDate,
            "season": season[0],
            "ori_link": decodeData(item.oriLink),
            "title": decodeData(item.title || ''),
            "summary": decodeData(item.summary || ''),
            "link": decodeData(item.link || '')
        });
    }

    return {"success": true, "message": `也许成功的抓取了第${body.issue}期的数据..`};
}

/* 解码数据, 避免数据渲染异常 */
function decodeData(data) {
    try {
        return decodeURIComponent(data);
    } catch(e) {
        return data;
    }
}
