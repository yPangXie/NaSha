"use strict";

const request = require('co-request');
const readUtil = require('../util');
const mercuryConfig = require(`${global.__nasha.APP_ROOT}/.config`).mercury;
const model = require(global.__nasha.APP_MODEL);

/* 新增数据 */
module.exports = async (body = {}, ctx) => {
    /* body.page的字段包含
        host: 页面的host地址
        favicon: favicon图片地址
        url: 当前页面的完整url地址
        title: 页面title信息(来自页面的title标签)
        description: 页面的description信息(来自meta标签)
        keywords: 页面的keywords数据(来自meta标签)
    */
    if(!body.page) return {"success": false, "message": "抓的数据乱七八糟.."};

    let pageObject = {};
    try {
        pageObject = JSON.parse(decodeURIComponent(body.page));
    } catch(e) {
        return {"success": false, "message": "数据格式异常, 跪了."}
    }

    /* 若页面的title或者description为空, 则尝试通过mercury的服务分析页面数据, 只能抓取出来 */
    if(!pageObject.title || !pageObject.description) {
        let smartPageInfo = await request({
            "url": `${mercuryConfig.url}${pageObject.url}`,
            "headers": {
                "Content-Type": "application/json",
                "x-api-key": mercuryConfig.token
            }
        });
        let smartPageInfoObject = JSON.parse(smartPageInfo.body);
        pageObject.title = pageObject.title || smartPageInfoObject.title || '';
        pageObject.description = pageObject.description || smartPageInfoObject.excerpt || '';
    }

    let searchRet = await model.leanCloud.read.searchByUrl(pageObject.url);
    if(searchRet && searchRet.length > 0) return {"success": false, "type": "duplicate", "id": searchRet[0].id, "message": `"${searchRet[0].createdAt.toLocaleString()}" 已经保存过了<br />DB objectId: ${searchRet[0].id}`}

    pageObject.favicon = readUtil.generateFaviconAbsoPath(pageObject.url, pageObject.favicon);
    await model.leanCloud.read.store(pageObject);
    return {"success": true, "message": "应该是保存成功了.."};
}
