"use strict"

/* 暴露的定时方法 */
module.exports.cmd = {
    /* 存储新文章 */
    "store": require('./cmd/store'),
    /* 校验来自微信 */
    "comefromWeixin": require('./cmd/weixin-comefrom-check'),
    /* 收到微信消息 */
    "recieveWeixinMessage": require('./cmd/weixin-recieve-message')
}
