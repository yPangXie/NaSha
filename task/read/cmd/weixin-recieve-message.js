"use strict";

const readUtil = require('../util');
const util = require('../../../util');

/* 校验来自微信服务器 */
module.exports = function *(ctx) {
    let pageUrl = '';
    /* 在接收到的值(body)中, 使用`toUserName`字段的值赋值给当前变量. */
    let responseFromUserName = '';
    /* 在接收到的值(body)中, 使用`FromUserName`字段的值赋值给当前变量. */
    let responseToUserName = '';
    try {
        pageUrl = ctx.request.body.xml.Content[0];
        responseFromUserName = ctx.request.body.xml.ToUserName[0];
        responseToUserName = ctx.request.body.xml.FromUserName[0];
    } catch(e) {
        console.log('recieve message error:', e);
    }

    let searchRet = yield util.leanCloud.read.searchByUrl(pageObject.url);
    /* 发来的是链接的时候, 做一些页面数据抓取和DB存储的操作 */
    let pageInformation = yield readUtil.grabPageInfo(pageUrl);
    yield util.leanCloud.read.store(pageInformation);

    let responseContent = `搞定, 抓取的是 ${pageUrl} 的数据.`;
    if(!pageUrl) responseContent = '发来的似乎不是url啊?';
    else if(searchRet && searchRet.length) responseContent = `${searchRet[0].createdAt.toLocaleString()}" 已经保存过了. DB objectId: ${searchRet[0].id}`;

    return generateResponseXML({
        "responseToUserName": responseToUserName,
        "responseFromUserName": responseFromUserName,
        "content": responseContent
    });
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
