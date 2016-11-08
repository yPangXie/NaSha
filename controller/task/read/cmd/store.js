"use strict";

const readUtil = require('../util');
const model = require(global.__nasha.APP_MODEL);

/* 新增数据 */
module.exports = async (body = {}, ctx) => {
    if(!body.page) return {"success": false, "message": "抓的数据乱七八糟.."};

    let pageObject = {};
    try {
        pageObject = JSON.parse(decodeURIComponent(body.page));
    } catch(e) {
        return {"success": false, "message": "数据格式异常, 跪了."}
    }

    let searchRet = await model.leanCloud.read.searchByUrl(pageObject.url);
    if(searchRet && searchRet.length > 0) return {"success": false, "type": "duplicate", "id": searchRet[0].id, "message": `"${searchRet[0].createdAt.toLocaleString()}" 已经保存过了<br />DB objectId: ${searchRet[0].id}`}

    pageObject.favicon = readUtil.generateFaviconAbsoPath(pageObject.url, pageObject.favicon);
    await model.leanCloud.read.store(pageObject);
    return {"success": true, "message": "应该是保存成功了.."};
}
