"use strict";

const cheerio = require('cheerio');
const request = require('co-request');
const toMarkdown = require('to-markdown');
const model = require(global.__nasha.APP_MODEL);
const url = "http://www.packal.org";
const listUrl = "http://www.packal.org/workflow-list?sort_by=created&sort_order=DESC&items_per_page=50";

/* workflow爬虫 */
module.exports = async (body, ctx) => {
    let urls = "";
    if(body && body.urls) {
        urls = body.urls;
    } else {
        let hasLatest = await module.exports.detectLatest();
        if(!hasLatest.success) return "Failed: no need to get workflows.";
        urls = hasLatest.urls;
    }

    let urlList = urls.split(',');
    for(let i = 0, len = urlList.length; i < len; i++) {
        let url = urlList[i];
        let result = await request(url, {"method": "GET", "timeout": 1000000});
        let $ = cheerio.load(result.body);

        let tags = [];
        let screenshots = [];
        $('.field-tags .field-item').each(function() {
            tags.push($(this).text().trim() || '');
        });
        $('.field-screenshots').each(function() {
            screenshots.push($(this).find('img').attr('src') || '');
        });
        let workflowData = {
            "author": $('.user-picture').closest('td').prev().text().trim() || "",
            "description": $('.field-short-description').text().trim() || "",
            "tags": tags.join(','),
            "github": $('.field-github-url a').attr('href') || "",
            "name": $('#page-title').text().trim() || "",
            "bundle_id": $('.field-bundle-id').text().trim() || "",
            "screenshots": screenshots.join(','),
            "icon_url": $('.field-icon img').attr('src') || "",
            "detail": toMarkdown($('.field-body').html() || ""),
            "download_url": $('.wf-download-link').attr('href') || "",
            "avatar": $('.user-picture img').attr('src') || ""
        };

        await model.leanCloud.workflows.store(workflowData);
    }

    await model.leanCloud.helper.applog(`Workflow - 也许成功抓取了${(urls || '')}页面的数据...`);
    return `True: ${urls}`;
}

/* 检测Packal中workflow的总数 */
module.exports.detectLatest = async ctx => {
    /* 未获取到缓存数据, 爬取页面 */
    let comboData = await Promise.all([
        request(url, {"method": "GET", "timeout": 100000}),
        model.leanCloud.workflows.getCurrentLatestTotal()
    ]);

    let specPageData = comboData[0];
    let currentTotalWorkflows = comboData[1];
    if(!specPageData || !specPageData.body) return {'success': false, "message": "Get home page data failed"};

    let $ = cheerio.load(specPageData.body, {normalizeWhitespace: true});
    let title = $('#w-and-t-stats').text().trim();
    let latestTotalWorkflows = title.match(/(\d+)/g) && title.match(/(\d+)/g)[0];

    /* 获取当前workflow的总数 */
    let currentTotal = currentTotalWorkflows && currentTotalWorkflows.get('latestTotal');

    /* 当前最新版高于DB中存储的最新版, 或者DB中特么压根没存数据的时候. 抓最新版的数据 */
    if((!currentTotal && latestTotalWorkflows) || (currentTotal && latestTotalWorkflows && +latestTotalWorkflows > +currentTotal)) {
        let urls = [];
        if(currentTotal && latestTotalWorkflows) {
            let newsTotal = +latestTotalWorkflows - (+currentTotal);
            let listPageData = await request(listUrl, {"method": "GET", "timeout": 100000});
            if(!listPageData || !listPageData.data) return {"success": false, "message": "Get page data of list failed."};

            let $listPage = cheerio.load(listPageData.body, {normalizeWhitespace: true});
            $listPage('h4').each(function(index) {
                if(index + 1 <= newsTotal) {
                    urls.push(url + ($(this).find('a').attr('href') || ''));
                }
            });
        }
        await model.leanCloud.workflows.storeLatestTotal(latestTotalWorkflows);

        return {
            "success": true,
            "total": latestTotalWorkflows,
            "urls": urls.join(',')
        };
    }

    return {
        "success": false,
        "message": "Failed for detecting latest finally."
    };
}
