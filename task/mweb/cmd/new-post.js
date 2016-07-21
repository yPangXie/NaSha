"use strict";

const mwebUtil = require('../util');
const util = require('../../../util');

/* 发布一篇文章 */
module.exports = function *(ctx) {
    let body = ctx.request.body;
    let validateUser = mwebUtil.validateUser(body);
    if(!validateUser.success) return this.body = validateUser;

    let jsonFormatPost = {};
    try {
        body.methodCall.params[0].param.forEach(paramItem => {
            let struct = paramItem.value[0].struct;
            if(!struct) return true;

            struct[0].member.forEach(memberItem => {
                let key = memberItem.name[0] || '';

                if(key == 'dateCreated') jsonFormatPost[key] = memberItem.value[0]['dateTime.iso8601'][0];
                else if(key == 'categories') jsonFormatPost[key] = memberItem.value[0].array[0].data.join(',');
                else jsonFormatPost[key] = memberItem.value[0].string[0];
            });
        });
    } catch(e) {}

    if(Object.keys(jsonFormatPost).length) {
        /* 暂时不校验是否提交成功. 就当一切操作都如丝般顺滑. */
        let mwebStoreResult = yield util.leanCloud.mweb.store({
            "content": jsonFormatPost.description,
            "categories": jsonFormatPost.categories,
            "date_created": jsonFormatPost.dateCreated,
            "keywords": jsonFormatPost.mt_keywords,
            "slug": jsonFormatPost.wp_slug,
            "title": jsonFormatPost.title
        });
    }

    return `<?xml version="1.0" encoding="ISO-8859-1"?>
        <methodResponse>
            <params>
                <param>
                    <value>
                        <string>0703</string>
                    </value>
                </param>
            </params>
        </methodResponse>`;
}
