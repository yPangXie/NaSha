"use strict"

/* 获取最新一期的内容 */
module.exports.getLatest = require('./cmd/get-latest');

/* 获取指定某一期 */
module.exports.getSpec = require('./cmd/get-spec');

/* 根据id, 爬去对应页面的数据 */
module.exports.spider = require('./cmd/spider');
