"use strict";

const wanquUtil = require('../util');
const util = require(`${global.__nasha.APP_CONTROLLER}/util`);
const model = require(global.__nasha.APP_MODEL);

/* 获取随机的几篇文章 */
module.exports = async (body, ctx) => {
    let ipObject = await util.getIP(ctx);

    /* 来源ip, 日志打点 */
    await model.leanCloud.wanqu.log(ipObject, `随机: 最多返回5篇文章`);
    /* 处理新用户数据 */
    await wanquUtil.newUser(body.mac || '');

    /* 逻辑如下:
        1. wanqu定时任务表抓最新一期的期数
        2. 随机筛选5期
        3. 分别获取5期的全部数据
        4. 每一期随机抽取一篇文章
        5. 构建返回值, 返回给调用方
    */

    let latestIssue = await model.leanCloud.wanqu.getCurrentLatestIssue();
    let randomIssueNumbers = [];
    /* 随机筛选N期(默认5期, 最大5期) */
    let count = body.count || 5;
    for(let i = 0; i < (count > 5 ? 5 : count); i++) {
        let randomNumber = Math.floor(Math.random() * (+latestIssue.get('latestIssue') + 1));
        randomIssueNumbers.push(randomNumber);
    }

    /* 获取每期的数据 */
    let randomArticles = [];
    for(let j = 0, l = randomIssueNumbers.length; j < l; j++) {
        let _currentIssues = await model.leanCloud.wanqu.getSpec(randomIssueNumbers[j] + '');
        let _randomIssueIndex = Math.floor(Math.random() * _currentIssues.length);
        randomArticles.push(_currentIssues[_randomIssueIndex]);
    }

    return await wanquUtil.generateResponse({
        "db": randomArticles,
        "clientVersion": body.clientVersion || ''
    });
}
