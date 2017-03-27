"use strict"

const urllib = require("urllib");

/* 扯淡. 普通函数即可, 目的是为了避免阻塞临时返回的数据. */
module.exports = (body, content, ctx) => {
    const responseUrl = body.response_url || '';
    if (!responseUrl) return false;

    urllib.request(responseUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        content: JSON.stringify({
            "response_type": "in_channel",
            "text": "你输入的那是个啥玩意儿..",
            "attachments": [
                {
                    "text": `默认的命令是bullshit, 目前还支持"express 快递号"`
                }
            ]
        })
    });
}
