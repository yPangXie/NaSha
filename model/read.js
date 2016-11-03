"use strict";

const LeanCloud = require('./initialize');

/* 添加湾区指定某期的数据 */
module.exports.store = function *(options) {
    /* 清缓存 */
    global.__nasha.APP_CACHE.del('readList');

    let readObject = new LeanCloud.Read();
    for(let key in options) readObject.set(key, options[key]);
    readObject.save();
}

/* 获取指定页的数据 */
module.exports.list = async (options) => {
    let readQuery = new LeanCloud.AV.Query('Read');
    // readQuery.equalTo('delete', false);
    readQuery.limit(options.limit);
    readQuery.skip(options.offset);
    readQuery.descending('createdAt');

    let ret = readQuery.find();
    return ret;
}

/* 获取指定日期之后的所有数据 */
module.exports.listAfterDate = function *(date) {
    let readQuery = new LeanCloud.AV.Query('Read');
    readQuery.greaterThan('createdAt', new Date(date));
    // readQuery.equalTo('delete', false);
    readQuery.limit(1000);

    let ret = readQuery.find();
    return ret
}

/* 基于url地址查询是否已经存在数据 */
module.exports.searchByUrl = function *(url) {
    let readQuery = new LeanCloud.AV.Query('Read');
    readQuery.equalTo('url', url);
    // readQuery.equalTo('delete', false);

    let ret = readQuery.find();
    return ret;
}

/* 基于关键字, 查询是否已经存在数据 */
module.exports.filter = function *(options) {
    let readQueryTitle = new LeanCloud.AV.Query('Read');
    let readQueryDescription = new LeanCloud.AV.Query('Read');
    let readQueryCreatedDate = new LeanCloud.AV.Query('Read');

    if(options.words) {
        readQueryTitle.contains('title', options.words);
        // readQueryTitle.equalTo('delete', false);
        readQueryDescription.contains('description', options.words);
        // readQueryDescription.equalTo('delete', false);
    }

    if(options.date) {
        let startDate = new Date(options.date).valueOf();
        let endDate = startDate + 1000 * 60 * 60 * 24;
        readQueryCreatedDate.lessThanOrEqualTo('createdAt', new Date(endDate));
        readQueryCreatedDate.greaterThanOrEqualTo('createdAt', new Date(startDate));
        // readQueryCreatedDate.equalTo('delete', false);
    }

    let queryOrCombo = LeanCloud.AV.Query.or(readQueryTitle, readQueryDescription);
    let queryAndCombo = LeanCloud.AV.Query.and(queryOrCombo, readQueryCreatedDate);

    queryAndCombo.descending('createdAt');
    queryAndCombo.limit(options.limt);
    queryAndCombo.skip(options.offset);

    let ret = queryAndCombo.find();
    return ret;
}

/* 指定时间点之后的数据总数 */
module.exports.daily = function *(date) {
    let readQuery = new LeanCloud.AV.Query('Read');
    // readQuery.equalTo('delete', false);
    readQuery.greaterThan('createdAt', new Date(date));

    let ret = readQuery.find();
    return ret;
}

/* 总数 */
module.exports.count = async (ctx, next) => {
    let readQuery = new LeanCloud.AV.Query('Read');
    // readQuery.equalTo('delete', false);
    readQuery.limit(1000);

    let ret = readQuery.count();
    return ret;
}

/* 移除某条数据(逻辑删除) */
module.exports.remove = function *(objectId) {
    /* 清缓存 */
    global.__nasha.APP_CACHE.del('readList');

    let logicalRemoveQuery = LeanCloud.AV.Object.createWithoutData('Read', objectId);
    logicalRemoveQuery.set('delete', true);
    logicalRemoveQuery.save();
}
