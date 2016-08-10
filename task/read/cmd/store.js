"use strict";

const readUtil = require('../util');
const util = require('../../../util');

/* 新增数据 */
module.exports = function *(query, ctx) {
    let url = query.url;
    if(!url) return {"success": false, "message": "url呢?"};

    let pageInformation = yield readUtil.grabPageInfo(url);
    yield util.leanCloud.read.store(pageInformation);

    if(query.callback) return `${query.callback}({"success": true, "message": "应该是保存成功了.."})`
    return {"success": true, "message": "应该是保存成功了.."};
}
