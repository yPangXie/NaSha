"use strict";

const readUtil = require('../util');
const model = require('../../../../model');

/* 新增数据 */
module.exports = function *(body, ctx) {
    if(!body || !body.page) return {"success": false, "message": "抓的数据乱七八糟.."};

    let pageObject = {};
    try {
        pageObject = JSON.parse(decodeURIComponent(body.page));
    } catch(e) {
        console.log(body.page);
        return {"success": false, "message": "数据格式异常, 跪了."}
    }

    let searchRet = yield model.leanCloud.read.searchByUrl(pageObject.url);
    if(searchRet && searchRet.length > 0) return {"success": false, "type": "duplicate", "id": searchRet[0].id, "message": `"${searchRet[0].createdAt.toLocaleString()}" 已经保存过了<br />DB objectId: ${searchRet[0].id}`}

    pageObject.favicon = readUtil.generateFaviconAbsoPath(pageObject.url, pageObject.favicon);
    yield model.leanCloud.read.store(pageObject);
    return {"success": true, "message": "应该是保存成功了.."};
}
