"use strict";

const LeanCloud = require('./initialize');

/* 添加湾区指定某期的数据 */
// module.exports.addWanqu = function *(options) {
module.exports.store = function *(options) {
    let wanquObject = new LeanCloud.Wanqu();
    for(let key in options) wanquObject.set(key, options[key]);
    wanquObject.save();
}

/* 获取最新一期的数据 */
// module.exports.getLatestWanqu = function *() {
module.exports.getLatest = function *() {
    let wanquQuery = new LeanCloud.AV.Query("Wanqu");
    wanquQuery.descending('createdAt');

    let latestSeasonData = yield wanquQuery.first();
    let season = latestSeasonData.get('season');

    let latestWanquQuery = new LeanCloud.AV.Query('Wanqu');
    latestWanquQuery.equalTo("season", season);

    return latestWanquQuery.find();
}

/* 根据期数, 搜索指定的数据 */
// module.exports.getSpecWanqu = function *(id) {
module.exports.getSpec = function *(id) {
    let wanquQuery = new LeanCloud.AV.Query("Wanqu");
    wanquQuery.equalTo("season", id);

    return wanquQuery.find();
}

/* 获取当前最新的Wanqu日报版本 */
module.exports.getCurrentLatestIssue = function *() {
    let wanquTimingQuery = new LeanCloud.AV.Query("WanquTiming");
    wanquTimingQuery.descending('createdAt');

    return wanquTimingQuery.first();
}

/* 存储最新版的Wanqu日报版本号 */
module.exports.storeLatestIssueVersion = function *(latestIssue) {
    let wanquTimingObject = new LeanCloud.WanquTiming();
    wanquTimingObject.set('latestIssue', latestIssue);
    wanquTimingObject.save();
}

/* 添加Wanqu日报搜索内容的日志 */
// module.exports.wanquLog = function *(ip) {
module.exports.log = function *(ip) {
    let WanquLogObject = new LeanCloud.WanquLog();
    WanquLogObject.set('ip', ip);
    WanquLogObject.save();
}

/* wanqu日报总数据量 */
// module.exports.wanquTotal = function *() {
module.exports.total = function *() {
    let wanquQuery = new LeanCloud.AV.Query('Wanqu');
    return wanquQuery.count();
}

/* 指定时间点之后的wanqu日志数据总数 */
// module.exports.wanquLogDaily = function *(date) {
module.exports.logDailyCount = function *(date) {
    let wanquLogQuery = new LeanCloud.AV.Query('WanquLog');
    wanquLogQuery.greaterThan('createdAt', new Date(date));
    return wanquLogQuery.find();
}

/* 指定时间点之后的爬取的wanqu日报数据总数 */
// module.exports.wanquSpiderDaily = function *(date) {
module.exports.spiderDaily = function *(date) {
    let wanquQuery = new LeanCloud.AV.Query('Wanqu');
    wanquQuery.greaterThan('createdAt', new Date(date));
    return wanquQuery.find();
}
