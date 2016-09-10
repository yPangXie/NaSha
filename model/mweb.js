"use strict";

const LeanCloud = require('./initialize');

/* 保存提交的数据 */
module.exports.store = function *(options) {
    let mwebObject = new LeanCloud.MWeb();
    for(let key in options) mwebObject.set(key, options[key]);
    return mwebObject.save();
}

/* 编辑数据 */
module.exports.edit = function *(id, data) {
    let editMWebObject = new LeanCloud.AV.Object.createWithoutData('MWeb', id);
    for(let key in data) editMWebObject.set(key, data[key]);
    editMWebObject.save();
}
