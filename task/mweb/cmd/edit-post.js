"use strict";

const mwebUtil = require('../util');
const model = require('../../../model');

/* 发布一篇文章 */
module.exports = function *(ctx) {
    let body = ctx.request.body;
    let validateUser = mwebUtil.validateUser(body);
    if(!validateUser.success) return this.body = validateUser;

    let jsonFormatPost = {"id": "", "data": {}};
    try {
        jsonFormatPost.id = body.methodCall.params[0].param[0].value[0].string[0];
        body.methodCall.params[0].param.forEach(paramItem => {
            let struct = paramItem.value[0].struct;
            if(!struct) return true;

            struct[0].member.forEach(memberItem => {
                let key = memberItem.name[0] || '';

                if(key == 'dateCreated') jsonFormatPost.data[key] = memberItem.value[0]['dateTime.iso8601'][0];
                else if(key == 'categories') {
                    jsonFormatPost.data[key] = memberItem.value[0].array[0].data[0] ? memberItem.value[0].array[0].data[0].value[0].string.join(',') : '';
                }
                else jsonFormatPost.data[key] = memberItem.value[0].string[0];
            });
        });
    } catch(e) {return false;}

    if(Object.keys(jsonFormatPost.data).length) {
        /* 暂时不校验是否提交成功. 就当一切操作都如丝般顺滑. */
        yield model.leanCloud.mweb.edit(jsonFormatPost.id, {
            "content": jsonFormatPost.data.description,
            "categories": jsonFormatPost.data.categories,
            "date_created": jsonFormatPost.data.dateCreated,
            "keywords": jsonFormatPost.data.mt_keywords,
            "slug": jsonFormatPost.data.wp_slug,
            "title": jsonFormatPost.data.title
        });
    }

    return true;
}
