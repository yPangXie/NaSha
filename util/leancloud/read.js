"use strict";

const LeanCloud = require('./initialize');

/* 添加湾区指定某期的数据 */
module.exports.store = function *(options) {
    let readObject = new LeanCloud.Read();
    for(let key in options) readObject.set(key, options[key]);
    readObject.save();
}

/* 指定时间点之后的数据总数 */
module.exports.daily = function *(date) {
    let readQuery = new LeanCloud.AV.Query('Read');
    readQuery.greaterThan('createdAt', new Date(date));
    return readQuery.find();
}
