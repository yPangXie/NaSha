"use strict"

const cheerio = require('cheerio');
const request = require('co-request');
const util = require('../../../util');
const url = "http://www.packal.org/";

/* 检测Packal中workflow的总数 */
module.exports = function *(ctx) {
    /* 未获取到缓存数据, 爬取页面 */
    let specPageData = yield request(url, {"method": "GET"});
    if(!specPageData || !specPageData.body) return {'success': false};

    let $ = cheerio.load(specPageData.body, {normalizeWhitespace: true});
    let title = $('#w-and-t-stats').text().trim();
    let totalWorkflows = title.match(/(\d+)/g) && title.match(/(\d+)/g)[0];

    /* 获取当前workflow的总数 */
    let latestTotalWorkflowsData = yield util.leanCloud.getLatestTotalWorkflows();
    let latestTotal = latestTotalWorkflowsData && latestTotalWorkflowsData.get('latestTotal');

    /* 当前最新版高于DB中存储的最新版, 或者DB中特么压根没存数据的时候. 抓最新版的数据 */
    if((!latestTotal && totalWorkflows) || (latestTotal && totalWorkflows && +totalWorkflows < +latestTotal)) {
        yield util.leanCloud.storeLatestTotalWorkflows(totalWorkflows);
        return {
            "success": true,
            "total": totalWorkflows
        };
    }

    return {
        "success": false
    };
}
