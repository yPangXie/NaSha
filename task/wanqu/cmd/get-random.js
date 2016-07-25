"use strict";
const util = require('../../../util');
const wanquUtil = require('../util');
const debugSymbol = '[Wanqu:get-random]';
/* 获取随机的几篇文章 */
module.exports = function *(ctx) {
    let ipObject = yield util.getIP(ctx);
    yield util.leanCloud.wanqu.log(ipObject, `随机: 最多返回5篇文章`);

    /* 逻辑如下:
        1. wanqu定时任务表抓最新一期的期数
        2. 随机筛选5期
        3. 分别获取5期的全部数据
        4. 每一期随机抽取一篇文章
        5. 构建返回值, 返回给调用方
    */

    let latestIssue = yield util.leanCloud.wanqu.getCurrentLatestIssue();
    let randomIssueNumbers = [];
    /* 随机筛选5期 */
    for(let i = 0; i < 5; i++) {
        let randomNumber = Math.floor(Math.random() * (+latestIssue.get('latestIssue') + 1));
        randomIssueNumbers.push(randomNumber);
    }

    /* 获取每期的数据 */
    let randomArticles = [];
    for(let j = 0, l = randomIssueNumbers.length; j < l; j++) {
        let _currentIssues = yield util.leanCloud.wanqu.getSpec(randomIssueNumbers[j] + '');
        let _randomIssueIndex = Math.floor(Math.random() * _currentIssues.length);
        randomArticles.push(_currentIssues[_randomIssueIndex]);
    }

    return wanquUtil.generateResponse(randomArticles);
}
