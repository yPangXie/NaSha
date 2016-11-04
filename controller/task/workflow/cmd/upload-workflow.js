"use strict";

const request = require('co-request');
const model = require(global.__nasha.APP_MODEL);

/* workflows文件下载及上传 */
module.exports = async (body, ctx) => {
    if(!body || !body.url) return {"success": "false", "message": "参数错误, 你得给我url地址哦"};

    let url = body.url;
    let fileData = await request(url, {"timeout": 1000000});
    await model.leanCloud.workflows.upload('xxx', fileData.body);

    return {"success": true, "message": "似乎上传成功了."};
}
