"use strict";

module.exports.cmd = {
    /* 校验来自微信 */
    "comefromWeixin": require('./cmd/comefrom-weixin'),
    /* 收到消息 */
    "recieveMessage": require('./cmd/recieve-message')
}
