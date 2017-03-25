"use strict"

const urllib = require("urllib");

/* 扯淡. 普通函数即可, 目的是为了避免阻塞临时返回的数据. */
module.exports = (body, ctx) => {
    const responseUrl = body.response_url || '';
    if (!responseUrl) return false;

    urllib.request(responseUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        content: JSON.stringify({
            "response_type": "in-channel",
            "text": "艾玛, 好使了. 不用担心超时了..",
            "attachments": [
                {
                    "text":"是的, 你被骗了, 我根本没有屌你, 就是测试接口好使不."
                }
            ]
        })
    });
}
