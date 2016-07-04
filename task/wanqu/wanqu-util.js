"use strict";
/* 格式化返回值 */
module.exports.generateResponse = (data) => {
    let resultData = data || [];
    let responseData = {
        "success": false,
        "data": {
            "title": '',
            "list": []
        }
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
