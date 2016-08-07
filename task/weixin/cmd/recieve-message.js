"use strict";



/* 校验来自微信服务器 */
module.exports = function *(body, ctx) {
    console.log(body);

    return 'success';
}
