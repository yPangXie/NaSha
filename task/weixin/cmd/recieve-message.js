"use strict";

const cheerio = require('cheerio');
const urllib = require('urllib');
const url = require('url');
const util = require('../../../util');

/* 校验来自微信服务器 */
module.exports = function *(ctx) {
    let content = '';
    /* 在接收到的值(body)中, 使用`toUserName`字段的值赋值给当前变量. */
    let responseFromUserName = '';
    /* 在接收到的值(body)中, 使用`FromUserName`字段的值赋值给当前变量. */
    let responseToUserName = '';
    try {
        content = ctx.request.body.xml.Content[0];
        responseFromUserName = ctx.request.body.xml.ToUserName[0];
        responseToUserName = ctx.request.body.xml.FromUserName[0];
    } catch(e) {
        console.log('recieve message error:', e);
    }

    /* 发来的是链接的时候, 做一些页面数据抓取和DB存储的操作 */
    let pageInformation = yield grabPageInfo(content);
    yield util.leanCloud.read.store(pageInformation);

    return generateResponseXML({
        "responseToUserName": responseToUserName,
        "responseFromUserName": responseFromUserName,
        "content": content
            ? `搞定了, 发来的内容是:
${content}`
            : "发生了一些不可描述的问题? 发来的数据里少了点儿什么.."
    });
}

/* 收到的指令是抓页面的时候, 执行该方法 */
function *grabPageInfo (urlString) {
    let pageData = yield urllib.requestThunk(urlString, {"timeout": 1000000, "followRedirect": true});
    let $ = cheerio.load(new Buffer(pageData.data).toString());

    /* 先去获取`favicon`的相对路径(也许是绝对路径, 不重要) */
    let faviconURLOri = $('link[rel="shortcut icon"], link[rel="short icon"]').attr('href') || '';
    let favicon = '';
    if(!/^(https|http|\/\/)/g.test(faviconURLOri)) {
        /* 转换为绝对路径 */
        let prefix = /^\//.test(faviconURLOri) ? '' : '/';
        let urlObject = url.parse(urlString);
        favicon = `${urlObject.protocol}//${urlObject.host}${prefix}${faviconURLOri}`;
    }

    return {
        url: urlString,
        favicon: favicon,
        title: $('title').text() || '',
        description: $('meta[name="description"]').attr('content') || '',
        keywords: $('meta[name="keywords"]').attr('content') || ''
    }
}

/* 生成返回值的`xml`结构 */
function generateResponseXML(options) {
    return `<xml>
        <ToUserName><![CDATA[${options.responseToUserName}]]></ToUserName>
        <FromUserName><![CDATA[${options.responseFromUserName}]]></FromUserName>
        <CreateTime>${new Date().valueOf()}</CreateTime>
        <MsgType><![CDATA[text]]></MsgType>
        <Content><![CDATA[${options.content}]]></Content>
    </xml>`;
}
