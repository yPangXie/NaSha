"use strict";

const util = require('../../util');

/* 格式化返回值 */
module.exports.generateResponse = function *(data){
    let resultData = data.db || [];
    let responseData = {
        "success": false,
        "data": {
            "title": '',
            "list": []
        }
    }
    /* 获取版本信息 */
    let versionInfo = yield util.leanCloud.wanqu.version();
    let latestVersion = versionInfo.get('version');
    /* 一个兼容逻辑
    1. 存量`workflow`, 传入的`clientVersion`字段值为`None`(Python). 这种需要在返回值中强行插入更新的相关信息
    2. 新版的`workflow`, 存在`clientVersion`字段, 因为客户端已经做了展示逻辑, 那么, 返回值只需要将`version`字段返回即可
     */
    if(!data.clientVersion || data.clientVersion == 'None') {
        responseData.data.list.push({
            "date": '2016-08-27',
            "link": 'http://www.packal.org/workflow/wan-qu-ri-bao-fei-guan-fang',
            "oriLink": 'http://www.packal.org/workflow/wan-qu-ri-bao-fei-guan-fang',
            "title": 'Latest version released!!',
            "summary": 'Workflow of wanqu has new version! Highly recommend to upgrade to version 5.0.0!'
        });
    } else if(data.clientVersion != latestVersion) {
        responseData.version = latestVersion;
    }

    if(resultData.length) {
        responseData.success = true;
        responseData.data.title = `${resultData[0].get('create_date')} 第${resultData[0].get('season')}期`;
        resultData.forEach(item => {
            responseData.data.list.push({
                "date": `${item.get('create_date')} 第${item.get('season')}期`,
                "link": item.get('link') || '',
                "oriLink": item.get('ori_link') || '',
                "title": item.get('title') || '',
                "summary": item.get('summary') || ''
            });
        });
    }

    return responseData;
}
