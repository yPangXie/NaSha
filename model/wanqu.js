"use strict";

const LeanCloud = require('./initialize');

/* 添加湾区指定某期的数据 */
module.exports.store = function *(options) {
    let wanquObject = new LeanCloud.Wanqu();
    for(let key in options) wanquObject.set(key, options[key]);
    wanquObject.save();
}

/* 获取最新一期的数据 */
module.exports.getLatest = function *() {
    let wanquQuery = new LeanCloud.AV.Query("Wanqu");
    wanquQuery.descending('createdAt');

    let latestSeasonData = yield wanquQuery.first();
    let season = latestSeasonData.get('season');

    let latestWanquQuery = new LeanCloud.AV.Query('Wanqu');
    latestWanquQuery.equalTo("season", season);

    let ret = latestWanquQuery.find();
    return ret;
}

/* 根据期数, 搜索指定的数据 */
module.exports.getSpec = function *(id) {
    let wanquQuery = new LeanCloud.AV.Query("Wanqu");
    wanquQuery.equalTo("season", id);

    let ret = wanquQuery.find();
    return ret;
}

/* 获取当前最新的Wanqu日报版本 */
module.exports.getCurrentLatestIssue = function *() {
    let wanquTimingQuery = new LeanCloud.AV.Query("WanquTiming");
    wanquTimingQuery.descending('createdAt');

    let ret = wanquTimingQuery.first();
    return ret;
}

/* 存储最新版的Wanqu日报版本号 */
module.exports.storeLatestIssueVersion = function *(latestIssue) {
    let wanquTimingObject = new LeanCloud.WanquTiming();
    wanquTimingObject.set('latestIssue', latestIssue);
    wanquTimingObject.save();
}

/* 添加Wanqu日报搜索内容的日志 */
module.exports.log = function *(ip, message) {
    let WanquLogObject = new LeanCloud.WanquLog();
    let ipObject = ip || {};

    WanquLogObject.set('ip', `${ipObject.ip} ${ipObject.info || ''}`);
    WanquLogObject.set('ua', ipObject.ua);
    WanquLogObject.set('message', message || '');
    WanquLogObject.save();
}

/* wanqu日报总数据量 */
module.exports.total = function *() {
    let wanquQuery = new LeanCloud.AV.Query('Wanqu');
    let ret = wanquQuery.count();
    return ret;
}

/* 指定时间点之后的wanqu日志数据总数 */
module.exports.logDailyCount = function *(date) {
    let wanquLogQuery = new LeanCloud.AV.Query('WanquLog');
    wanquLogQuery.greaterThan('createdAt', new Date(date));
    wanquLogQuery.limit(1000);

    let ret = wanquLogQuery.find();
    return ret;
}

/* 指定时间点之后的爬取的wanqu日报数据总数 */
module.exports.spiderDaily = function *(date) {
    let wanquQuery = new LeanCloud.AV.Query('Wanqu');
    wanquQuery.greaterThan('createdAt', new Date(date));

    let ret = wanquQuery.find();
    return ret;
}

/* 获取wanqu日报的最新版本 */
module.exports.version = function *() {
    let wanquQuery = new LeanCloud.AV.Query('WanquInfo');
    wanquQuery.descending('createdAt');
    let ret = wanquQuery.first();
    return ret;
}

/* 基于用户的Mac地址查询 */
module.exports.searchByMac = function *(mac) {
    let wanquUsersQuery = new LeanCloud.AV.Query('WanquUsers');
    wanquUsersQuery.equalTo('mac', mac);

    let ret = wanquUsersQuery.find();
    return ret;
}

/* 存储用户的Mac地址信息 */
module.exports.storeMac = function *(mac) {
    let wanquUsersObject = new LeanCloud.WanquUsers();
    wanquUsersObject.set('mac', mac);
    wanquUsersObject.save();
}
