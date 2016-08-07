"use strict";

const crypto = require('crypto');
const config = require('../../../.config').weixin;

/* 校验来自微信服务器 */
module.exports = ctx => {
    let query = ctx.query || {};

    let signature = query.signature || '';
    let echostr = query.echostr || '';
    let timestamp = query.timestamp || '';
    let nonce = query.nonce || '';

    if(!signature || !echostr || !timestamp || !nonce) return false;

    let sha1 = crypto.createHash('sha1');
    sha1.update([config.token, nonce, timestamp].sort().join(''));
    let manuallySign = sha1.digest('hex');
    console.log(`manually: ${manuallySign}, querySign: ${signature}`);

    return echostr;
}
