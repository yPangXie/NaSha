"use strict";

const LeanCloud = require('./initialize');

/* 添加湾区指定某期的数据 */
module.exports.store = function *(options) {
    let readObject = new LeanCloud.Read();
    for(let key in options) readObject.set(key, options[key]);
    readObject.save();
}

/* 获取指定页的数据 */
module.exports.list = function *(options) {
    let readQuery = new LeanCloud.AV.Query('Read');
    readQuery.limit(options.limit);
    readQuery.skip(options.offset);
    readQuery.descending('createdAt');
    return readQuery.find();
}

/* 获取指定日期之后的所有数据 */
module.exports.listAfterDate = function *(date) {
    let readQuery = new LeanCloud.AV.Query('Read');
    readQuery.greaterThan('createdAt', new Date(date));
    readQuery.limit(1000);

    return readQuery.find();
}

/* 基于url地址查询是否已经存在数据 */
module.exports.searchByUrl = function *(url) {
    let readQuery = new LeanCloud.AV.Query('Read');
    readQuery.equalTo('url', url);
    return readQuery.find();
}

/* 指定时间点之后的数据总数 */
module.exports.daily = function *(date) {
    let readQuery = new LeanCloud.AV.Query('Read');
    readQuery.greaterThan('createdAt', new Date(date));
    return readQuery.find();
}
