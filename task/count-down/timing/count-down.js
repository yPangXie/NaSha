"use strict"

/* 获取距离指定日期还有多久 */
module.exports = function *(target) {
    let targetTime = new Date(target).valueOf();
    let now = new Date().valueOf();
    let days = Math.ceil((targetTime - now) / 1000 / 60 / 60 / 24);

    return {
        "success": false,
        "days": days
    };
}
