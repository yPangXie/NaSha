"use strict"

/* 暴露cmd方法 */
module.exports.cmd = {
    /* 获取最新一期的内容 */
    "getLatest": require('./cmd/get-latest'),
    /* 获取指定某一期 */
    "getSpec": require('./cmd/get-spec'),
    /* 根据id, 爬去对应页面的数据 */
    "spider": require('./cmd/spider'),
    /* 获取随机的5篇文章 */
    "getRandom": require('./cmd/get-random')
}
