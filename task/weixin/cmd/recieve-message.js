"use strict";



/* 校验来自微信服务器 */
module.exports = function *(body, ctx) {
    let content = '';
    /* 在接收到的值(body)中, 使用`toUserName`字段的值赋值给当前变量. */
    let responseFromUserName = '';
    /* 在接收到的值(body)中, 使用`FromUserName`字段的值赋值给当前变量. */
    let responseToUserName = '';
    try {
        content = body.xml.Content[0];
        responseFromUserName = body.xml.FromUserName[0];
        responseToUserName = body.xml.ToUserName[0];
    } catch(e) {}

    let responseXMLParams = {
        "responseToUserName": responseToUserName,
        "responseFromUserName": responseFromUserName,
        "content": "搞定了."
    }
    console.log(`responseXMLParams:`, responseXMLParams);
    if(!content) responseXMLParams.content = "发生了一些不可描述的问题? 发来的数据里少了点儿什么..";

    return generateResponseXML(responseXMLParams);
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
