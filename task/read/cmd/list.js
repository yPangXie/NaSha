"use strict";

const readUtil = require('../util');
const util = require('../../../util');

/* 获取全部数据(单页最多20条) */
module.exports = function *(body, ctx) {
    let limit = (body || {}).limit || 20;
    let page = (body || {}).page || 0;
    if(!/\d+/.test(limit) || !/\d+/g.test(page)) return {"success": false, "message": "传的什么参数.. 要数字啊.."};

    let result = yield util.leanCloud.read.list({
        "limit": limit,
        "offset": page * limit
    });

    return result;
}
