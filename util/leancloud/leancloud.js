"use strict";

const AV = require('avoscloud-sdk');
const leanCloudSecret = require('./.secret');
AV.initialize(leanCloudSecret.appId, leanCloudSecret.appKey);

const Wanqu = AV.Object.extend('Wanqu');
const Workflows = AV.Object.extend('Workflows');
const WanquLog = AV.Object.extend('WanquLog');
const WanquTiming = AV.Object.extend('WanquTiming');
const WorkflowTiming = AV.Object.extend('WorkflowTiming');
const AppLog = AV.Object.extend('AppLog');

/* 添加湾区指定某期的数据 */
module.exports.addWanqu = function *(options) {
    let wanquObject = new Wanqu();

    for(let key in options) {
        wanquObject.set(key, options[key]);
    }

    wanquObject.save();
}

/* 获取最新一期的数据 */
module.exports.getLatestWanqu = function *() {
    let wanquQuery = new AV.Query("Wanqu");
    wanquQuery.descending('createdAt');

    let latestSeasonData = yield wanquQuery.first();
    let season = latestSeasonData.get('season');

    let latestWanquQuery = new AV.Query('Wanqu');
    latestWanquQuery.equalTo("season", season);

    return latestWanquQuery.find();
}

/* 根据期数, 搜索指定的数据 */
module.exports.getSpecWanqu = function *(id) {
    let wanquQuery = new AV.Query("Wanqu");
    wanquQuery.equalTo("season", id);

    return wanquQuery.find();
}

/* 添加workflow */
module.exports.addWorkflow = function *(options) {
    let WorkflowsObject = new Workflows();

    for(let key in options) {
        WorkflowsObject.set(key, options[key]);
    }

    WorkflowsObject.save();
}

/* 添加Wanqu日报搜索内容的日志 */
module.exports.wanquLog = function *(ip) {
    let WanquLogObject = new WanquLog();
    WanquLogObject.set('ip', ip);
    WanquLogObject.save();
}

/* 上传文件 */
module.exports.uploadWorkflow = function *(fileName, fileData) {
    // let file = new AV.File(fileName, fileData);
    // file.save();
}

/* 获取当前最新的Wanqu日报版本 */
module.exports.getCurrentLatestIssue = function *() {
    let wanquTimingQuery = new AV.Query("WanquTiming");
    wanquTimingQuery.descending('createdAt');

    return wanquTimingQuery.first();
}

/* 存储最新版的Wanqu日报版本号 */
module.exports.storeLatestIssueVersion = function *(latestIssue) {
    let wanquTimingObject = new WanquTiming();
    wanquTimingObject.set('latestIssue', latestIssue);
    wanquTimingObject.save();
}

/* 获取当前数据库中, workflow的总数 */
module.exports.getCurrentLatestTotalWorkflows = function *() {
    let workflowTimingQuery = new AV.Query("WorkflowTiming");
    workflowTimingQuery.descending('createdAt');

    return workflowTimingQuery.first();
}

/* 存储当前最新的workflow总数 */
module.exports.storeLatestTotalWorkflows = function *(latestTotal) {
    let workflowTimingObject = new WorkflowTiming();
    workflowTimingObject.set('latestTotal', latestTotal);
    workflowTimingObject.save();
}

/* 发送短信通知 */
module.exports.sms = function *(cronName) {
    if(!leanCloudSecret.phoneNumber || !cronName) return false;

    AV.Cloud.requestSmsCode({
        mobilePhoneNumber: leanCloudSecret.phoneNumber,
        template: 'Cron_Job_Status',
        cron_job_name: cronName
    }).then(function(){
        //发送成功
        co(function *() {
            yield module.exports.log(`${cronName}: 短信发送成功`);
        });
    }, function(err){
        //发送失败
        co(function *() {
            yield module.exports.log(`${cronName}: 短信发送失败, `, err);
        });
    });
}

/* 存储日志信息 */
module.exports.log = function *(message, error) {
    if(!message) return false;
    let currentDate = new Date();
    let AppLogObject = new AppLog();
    AppLogObject.set("message", message || '');
    AppLogObject.save();

    console.log(`[${currentDate.toLocaleDateString()} ${currentDate.toLocaleTimeString()}] - ${message}.`, error || '');
}
