"use strict"

/* 暴露cmd方法 */
module.exports.cmd = {
    /* workflows文件下载及上传 */
    "grabAndUploadWorkflow": require('./cmd/upload-workflow'),
    /* workflow爬虫 */
    "spider": require('./cmd/spider')
}

/* 暴露的定时方法 */
module.exports.timing = {
    "detectLatest": require('./timing/detect-latest')
}
