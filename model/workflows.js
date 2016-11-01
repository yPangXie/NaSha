"use strict";

const LeanCloud = require('./initialize');

/* 添加workflow */
module.exports.store = function *(options) {
    let WorkflowsObject = new LeanCloud.Workflows();
    for(let key in options) WorkflowsObject.set(key, options[key]);
    WorkflowsObject.save();
}

/* 上传文件 */
module.exports.upload = function *(fileName, fileData) {
    // let file = new LeanCloud.AV.File(fileName, fileData);
    // file.save();
}

/* 获取当前数据库中, workflow的总数 */
module.exports.getCurrentLatestTotal = function *() {
    let workflowTimingQuery = new LeanCloud.AV.Query("WorkflowTiming");
    workflowTimingQuery.descending('createdAt');

    let ret = workflowTimingQuery.first();
    return ret;
}

/* 存储当前最新的workflow总数 */
module.exports.storeLatestTotal = function *(latestTotal) {
    let workflowTimingObject = new LeanCloud.WorkflowTiming();
    workflowTimingObject.set('latestTotal', latestTotal);
    workflowTimingObject.save();
}

/* workflow总数据量 */
module.exports.total = function *() {
    let workflowsQuery = new LeanCloud.AV.Query('Workflows');

    let ret = workflowsQuery.count();
    return ret;
}

/* 指定时间点之后的爬取的workflow数据总数 */
module.exports.spiderDaily = function *(date) {
    let workflowQuery = new LeanCloud.AV.Query('Workflows');
    workflowQuery.greaterThan('createdAt', new Date(date));

    let ret = workflowQuery.find();
    return ret;
}
