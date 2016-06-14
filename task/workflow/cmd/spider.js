"use strict";

const cheerio = require('cheerio');
const urllib = require('urllib');
const toMarkdown = require('to-markdown');
const util = require('../../../util');

/* workflow爬虫 */
module.exports = function *(body, ctx) {
    if(!body || !body.url) return {"success": "false", "message": "参数错误, 你得给我url地址啊"};
    let url = body.url;

    let result = yield urllib.requestThunk(url, {"timeout": 1000000});
    if(!result || !result.data) {
        console.log(`FAILED: ${url}`);
        return getPageData(workflowsURLList.shift());
    }
    let $ = cheerio.load(new Buffer(result.data).toString());
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

    yield util.leanCloud.addWorkflow(workflowData);

    return {"success": true, "message": `也许成功抓取了${body.url}页面的数据...`};
}
