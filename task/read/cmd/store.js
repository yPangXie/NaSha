"use strict";

const util = require('../../../util');

/* 新增数据 */
module.exports = function *(body, ctx) {
    yield util.leanCloud.read.store({
        "title": body["title"] || "",
        "description": body["description"] || "",
        "keywords": body["keywords"] || "",
        "tags": body["tags"] || "",
        "favicon": body["favicon"] || "",
        "url": body["url"] || ""
    });

    return {"success": true, "message": "应该是保存成功了.."};
}
