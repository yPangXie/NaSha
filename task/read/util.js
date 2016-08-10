"use strict";

const url = require('url');
const urllib = require("urllib");
const cheerio = require("cheerio");

/* 收到的指令是抓页面的时候, 执行该方法 */
module.exports.grabPageInfo = function *(urlString) {
    let pageData = yield urllib.requestThunk(urlString, {"timeout": 1000000, "followRedirect": true});
    let $ = cheerio.load(new Buffer(pageData.data).toString());

    /* 先去获取`favicon`的相对路径(也许是绝对路径, 不重要) */
    let favicon = $('link[rel="shortcut icon"]').attr('href')
                || $('link[rel="short icon"]').attr('href')
                || $('link[rel="apple-touch-icon"]').attr('href')
                || $('meta[itemprop="image"]').attr('content')
                || '';

    if(!/^(https|http|\/\/)/g.test(favicon)) {
        /* 转换为绝对路径 */
        let prefix = /^\//.test(favicon) ? '' : '/';
        let urlObject = url.parse(urlString);
        favicon = `${urlObject.protocol}//${urlObject.host}${prefix}${favicon}`;
    }

    return {
        url: urlString,
        favicon: favicon,
        title: $('title').text() || '',
        description: $('meta[name="description"]').attr('content') || '',
        keywords: $('meta[name="keywords"]').attr('content') || ''
    }
}
