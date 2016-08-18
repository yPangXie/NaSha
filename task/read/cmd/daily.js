"use strict";

const mailgunConfig = require('../../../.config').mailgun;
const mailgun = require('mailgun-js')({
    apiKey: mailgunConfig.apiKey,
    domain: mailgunConfig.domain
});
const mailcomposer = require('mailcomposer');
const co = require('co');
const util = require('../../../util');

/* 获取当天新增的数据, 邮件发送 */
module.exports = function *(ctx) {
    let dateStart = util.getYesterday(`${new Date().toLocaleDateString()} 09:00:00`);
    let dataList = yield util.leanCloud.read.listAfterDate(dateStart);

    if(dataList.length == 0) return {"success": false, "message": "今儿啥都没读.."};
    let mailContentHtml = '';
    dataList.forEach(item => {
        mailContentHtml += `<li><a href="${item.get('url')}">${item.get('title')}</a><p>${item.get('description')}</p></li>`;
    });

    let mailDataDefine = {
        from: `NaSha(Mr.Krabs) <y@${mailgunConfig.domain}>`,
        to: mailgunConfig.mailList,
        subject: 'NaSha日报',
        html: `
            <style type="text/css">
            #wrap {width: 80%; margin: 0 auto;}
            ul {margin: 0 auto; padding: 0;}
            li {padding: 5px 10px;}
            a {text-decoration: none; color: #155fad;}
            a:hover {text-decoration: underline;}
            p {font-size: 12px; color: #CCC; margin: 5px 0; padding: 0;}
            .title {font-size: 20px; font-weight: bold; margin: 0 0 20px; padding: 0; color: #000;}
            .title-des {color: #333; font-size: 16px; margin-bottom: 20px;}
            </style>
            <div id="wrap">
                <h1 class="title">NaSha日报.</h1>
                <p class="title-des">头一天儿看的内容, 都在这儿了.. 回顾下, 是不是离梦想更远了??</p>
                <ul>${mailContentHtml}</ul>
            </div>
        `
    };

    let mailSendResult = yield mailgun.messages().send(mailDataDefine);
    return {"success": true, "message": "应该是发送成功了."};
}
