"use strict"

const urllib = require("urllib");

/* 快递信息查询 */
module.exports = (body, content, ctx) => {
    const responseUrl = body.response_url || '';
    if (!responseUrl) return false;

    /* 获取快递公司 */
    urllib.request(`https://www.kuaidi100.com/autonumber/autoComNum?text=${content}`).then(response => {
        let company = '';
        try {
            company = JSON.parse(new Buffer(response.data).toString()).auto[0].comCode;
        } catch(e) {}
        return company;
    }).then(com => {
        if (!com) return false;
        return urllib.request(`https://www.kuaidi100.com/query?type=${com}&postid=${content}&id=1&valicode=&temp=${Math.random()}`)
    }).then(express => {
        let expressData = {};
        let res2Slack = [];
        try {
            expressData = JSON.parse(new Buffer(express.data).toString()).data;
        } catch(e) {}
        if(!expressData.length) return false;
        expressData.forEach(item => {
            if(item.time && item.context) res2Slack.push({
                "text": `${item.time}: ${item.context}`
            });
        });

        return res2Slack;
    }).then(data2Slack => {
        data2Slack.push({
            "footer": "NaSha API",
            "footer_icon": "http://wx4.sinaimg.cn/large/6d6970b9gy1fe19chivbfj20dw0dw3z0.jpg",
            "ts": Date.now()
        })
        urllib.request(responseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            content: JSON.stringify({
                "text": `单号 *${content}* 的物流信息如下`,
                "attachments": data2Slack
            })
        });
    });
}
