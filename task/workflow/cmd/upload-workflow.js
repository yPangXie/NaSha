"use strict";

const urllib = require('urllib');
const util = require('../../../util');

/* workflows文件下载及上传 */
module.exports = function *(body, ctx) {
    if(!body || !body.url) return {"success": "false", "message": "参数错误, 你得给我url地址哦"};

    let url = body.url;
    let fileData = yield urllib.requestThunk(url, {"timeout": 1000000});
    yield util.leanCloud.uploadWorkflow('xxx', fileData.data);

    return {"success": true, "message": "似乎上传成功了."};
}
