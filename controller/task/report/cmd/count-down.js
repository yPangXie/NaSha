"use strict"

const model = require('../../../../model');

/* 获取距离指定日期还有多久 */
module.exports = function *(ctx, targetTimeString) {
    let target = targetTimeString || "2016-10-01 00:00:00"
    let targetTime = new Date(target).valueOf();
    let now = new Date();
    let days = Math.ceil((targetTime - now.valueOf()) / 1000 / 60 / 60 / 24);

    yield model.leanCloud.helper.sms({
        "template": 'Count_Down',
        "now": `${now.getFullYear()}年${(now.getMonth() + 1)}月${now.getDate()}日`,
        "target_date": "2016年10月1日",
        "time": `大约${days}天`
    });
}
