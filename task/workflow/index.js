"use strict"

/* 暴露cmd方法 */
module.exports.cmd = {
    /* workflows文件下载及上传 */
    "grabAndUpload": require('./cmd/upload-workflow'),
    /* workflow爬虫 */
    "spider": require('./cmd/spider')
}
