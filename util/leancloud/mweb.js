"use strict";

const LeanCloud = require('./initialize');

/* 保存提交的数据 */
module.exports.store = function *(options) {
    let mwebObject = new LeanCloud.MWeb();
    for(let key in options) mwebObject.set(key, options[key]);
    return mwebObject.save();
}
