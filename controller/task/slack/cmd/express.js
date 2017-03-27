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
                "text": `${item.context} - ${item.time}`
            });
        });

        return res2Slack;
    }).then(data2Slack => {
        urllib.request(responseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            content: JSON.stringify({
                "response_type": "in-channel",
                "text": "物流信息如下..",
                "attachments": data2Slack
            })
        });
    });
}
