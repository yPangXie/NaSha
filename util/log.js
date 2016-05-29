"use strict"

/* 简答的日志模块, 直接打印到系统标准输出 */
module.exports = function (message, type) {
    let logType = type || 'warn';
    let timestampData = timestamp();
    console.log(`[${timestampData}] ${logType} - ${message}`);
}

function timestamp() {
    let time = new Date();
    let year = time.getFullYear();
    let month = ('0' + (time.getMonth() + 1)).slice(-2);
    let day = ('0' + time.getDate()).slice(-2);
    let hour = ('0' + time.getHours()).slice(-2);
    let minute = ('0' + time.getMinutes()).slice(-2);
    let second = ('0' + time.getSeconds()).slice(-2);

    return `${year}-${month}-${day} ${hour}:${minute}:${second}`;
}
