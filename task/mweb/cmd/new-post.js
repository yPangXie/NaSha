"use strict";

const mwebUtil = require('../mweb-util');

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
                else if(key == 'categories') jsonFormatPost[key] = memberItem.value[0].array[0].data;
                else jsonFormatPost[key] = memberItem.value[0].string[0];
            });
        });
    } catch(e) {}

    /* TDB: 数据入库, jsonFormatPost */
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
