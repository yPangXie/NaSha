"use strict";

const readUtil = require('../util');
const util = require('../../../util');

/* 新增数据 */
module.exports = function *(body, ctx) {
    if(!body || !Object.keys(body.page || {}).length) return {"success": false, "message": "抓的数据乱七八糟.."};

    let searchRet = yield util.leanCloud.read.searchByUrl(body.page.url);
    if(searchRet && searchRet.length > 0) return {"success": false, "message": `"${searchRet[0].createdAt.toLocaleString()}" 已经保存过了<br />DB objectId: ${searchRet[0].id}`}

    yield util.leanCloud.read.store(body.page);
    return {"success": true, "message": "应该是保存成功了.."};
}
