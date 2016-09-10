"use strict"

/* 暴露的定时方法 */
module.exports.cmd = {
    /* 存储新文章 */
    "store": require('./cmd/store'),
    /* 获取每天的数据 */
    "daily": require('./cmd/daily'),
    /* 获取某一天的list */
    "list": require('./cmd/list'),
    /* 校验来自微信 */
    "comefromWeixin": require('./cmd/weixin-comefrom-check'),
    /* 收到微信消息 */
    "recieveWeixinMessage": require('./cmd/weixin-recieve-message')
}
