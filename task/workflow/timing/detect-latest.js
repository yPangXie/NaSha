"use strict"

const cheerio = require('cheerio');
const request = require('co-request');
const util = require('../../../util');
const url = "http://www.packal.org";
const listUrl = "http://www.packal.org/workflow-list?sort_by=created&sort_order=DESC&items_per_page=50";

/* 检测Packal中workflow的总数 */
module.exports = function *(ctx) {
    /* 未获取到缓存数据, 爬取页面 */
    let specPageData = yield request(url, {"method": "GET", "timeout": 100000});
    if(!specPageData || !specPageData.body) return {'success': false, "message": "Get home page data failed"};

    let $ = cheerio.load(specPageData.body, {normalizeWhitespace: true});
    let title = $('#w-and-t-stats').text().trim();
    let latestTotalWorkflows = title.match(/(\d+)/g) && title.match(/(\d+)/g)[0];

    /* 获取当前workflow的总数 */
    let currentTotalWorkflows = yield util.leanCloud.getCurrentLatestTotalWorkflows();
    let currentTotal = currentTotalWorkflows && currentTotalWorkflows.get('latestTotal');

    /* 当前最新版高于DB中存储的最新版, 或者DB中特么压根没存数据的时候. 抓最新版的数据 */
    if((!currentTotal && latestTotalWorkflows) || (currentTotal && latestTotalWorkflows && +latestTotalWorkflows > +currentTotal)) {
        let urls = [];
        if(currentTotal && latestTotalWorkflows) {
            let newsTotal = +latestTotalWorkflows - (+currentTotal);
            let listPageData = yield request(listUrl, {"method": "GET", "timeout": 100000});
            if(!listPageData || !listPageData.body) return {"success": false, "message": "Get page data of list failed."};

            let $listPage = cheerio.load(listPageData.body, {normalizeWhitespace: true});
            $listPage('h4').each(function(index) {
                if(index + 1 <= newsTotal) {
                    urls.push(url + ($(this).find('a').attr('href') || ''));
                }
            });
        }
        yield util.leanCloud.storeLatestTotalWorkflows(latestTotalWorkflows);

        return {
            "success": true,
            "total": latestTotalWorkflows,
            "urls": urls
        };
    }

    return {
        "success": false,
        "message": "Failed for detecting latest finally."
    };
}
