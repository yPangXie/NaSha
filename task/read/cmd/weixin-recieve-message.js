"use strict";

const readUtil = require('../util');
const util = require('../../../util');

/* 校验来自微信服务器 */
module.exports = function *(from, ctx) {
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
    let pageInformation = yield readUtil.grabPageInfo(content);
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
