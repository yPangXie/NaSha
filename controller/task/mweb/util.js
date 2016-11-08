"use strict";

const crypto = require('crypto');
const config = require(`${global.__nasha.APP_ROOT}/.config`);

/* 加密算法 */
let encode = (data = '') => {
    let md5 = crypto.createHash('md5');
    md5.update(`${data}${config.mweb.salt}`);
    return md5.digest('hex');
}

/* 校验用户名, 密码 */
module.exports.validateUser = (data = {}) => {
    let userName = '';
    let password = '';

    try {
        let paramData = data.methodCall.params[0].param;
        userName = paramData[1].value[0].string[0];
        password = paramData[2].value[0].string[0];
    } catch(e) {};

    if(!userName || !password) return this.body = {"success": false, "message": "User info is invalid."};

    let encodeUserName = encode(userName);
    let encodedPassword = encode(password);
    if(config.mweb.authorized[encodeUserName] == encodedPassword) {
        return this.body = {"success": true};
    } else {
        return this.body = {"success": false, "message": "Not authorized user."};
    }
}
