"use strict";

const model = require(global.__nasha.APP_MODEL);

/* 删除数据 */
module.exports = async (body, ctx) => {
    if(!body || !body.id) return {"success": false, "message": "传的什么参数.. objectId呢.."};
    return await model.leanCloud.read.remove(body.id);
}
