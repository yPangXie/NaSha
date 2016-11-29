"use strict";

const mailgunConfig = require(`${global.__nasha.APP_ROOT}/.config`).mailgun;
const mailgun = require('mailgun-js')({
    apiKey: mailgunConfig.apiKey,
    domain: mailgunConfig.domain
});
const mailcomposer = require('mailcomposer');
const co = require('co');
const util = require(`${global.__nasha.APP_CONTROLLER}/util`);
const model = require(global.__nasha.APP_MODEL);

/* 获取当天新增的数据, 邮件发送 */
module.exports = async ctx => {
    let dateStart = util.getYesterday(`${new Date().toLocaleDateString()} 09:00:00`);
    let dataList = await model.leanCloud.read.listAfterDate(dateStart);

    if(dataList.length == 0) return {"success": false, "message": "今儿啥都没读.."};

    /* 随机一张图片(目前采用及其暴力的办法搞定) */
    let imagesPool = [
        'http://ww1.sinaimg.cn/large/6d6970b9gw1fa90dt39egj20go09dmyu.jpg',
        'http://ww3.sinaimg.cn/mw690/6d6970b9gw1fa90dw0jokj20go09dgm9.jpg',
        'http://ww4.sinaimg.cn/mw690/6d6970b9gw1fa90cxfscfj20go09ddho.jpg',
        'http://ww4.sinaimg.cn/mw690/6d6970b9gw1fa90czhakfj20go09ddgr.jpg',
        'http://ww4.sinaimg.cn/mw690/6d6970b9gw1fa90d1llt9j20go09daaw.jpg',
        'http://ww3.sinaimg.cn/mw690/6d6970b9gw1fa90d3yd2rj20go09dacd.jpg',
        'http://ww2.sinaimg.cn/mw690/6d6970b9gw1fa90d6a2ubj20go09dwfn.jpg',
        'http://ww1.sinaimg.cn/mw690/6d6970b9gw1fa90d8qoi8j20go09daba.jpg',
        'http://ww2.sinaimg.cn/mw690/6d6970b9gw1fa90ddj0quj20go09d76a.jpg',
        'http://ww3.sinaimg.cn/mw690/6d6970b9gw1fa90dfyzuvj20go09djtb.jpg',
        'http://ww4.sinaimg.cn/mw690/6d6970b9gw1fa90dim4idj20go09dta8.jpg'
    ];
    let selectedImageIndex = Math.floor((Math.random() * imagesPool.length));

    let mailContentHtml = '';
    dataList.forEach(item => {
        mailContentHtml += `<tr>
			<td align="left" style="color: rgb(89, 89, 89); font-family: 'Roboto', sans-serif; font-size: 18px; font-weight: 500; line-height: 30px; padding-top: 25px;">
				<a href="${item.get('url')}" style="color: rgb(253, 57, 81); text-decoration: none;">${item.get('title')}</a>
			</td>
		</tr>
		<tr>
			<td align="left" style="color: rgb(143, 150, 161); font-family: 'Roboto', sans-serif; font-size: 15px; font-weight: 400; line-height: 26px; padding-right: 15px; padding-top: 15px;">
				${item.get('description')}
			</td>
		</tr>`;
    });

    let mailDataDefine = {
        from: `NaSha(Mr.Krabs) <y@${mailgunConfig.domain}>`,
        to: mailgunConfig.mailList,
        subject: 'NaSha日报',
        html: `
            <table align="center" border="0" cellpadding="0" cellspacing="0" style="opacity: 1; position: relative; z-index: 0;" width="100%">
                <tr>
                    <td>
                        <table align="center" border="0" cellpadding="0" cellspacing="0" style="max-width: 800px;" width="100%">
                            <tr><td height="20"></td></tr>
                            <tr>
                                <td>
                                    <table align="center" border="0" cellpadding="0" cellspacing="0" class="table-inner" width="600">
                                        <tr>
                                            <td align="left" style="font-family: 'Roboto', sans-serif; font-size: 30px; font-weight: 700; line-height: 30px;letter-spacing: 2px; text-transform: uppercase; padding-top: 25px;">
                                                NaSha Daily
                                            </td>
                                        </tr>
                                        <tr><td height="20"></td></tr>
                                        <tr>
                                            <td align="center" valign="middle">
                                                <img alt="img" width="600" src="${imagesPool[selectedImageIndex]}" style="border: 0px; display: block; font-size: 0px; line-height: 0px;" width="600"
                                                />
                                            </td>
                                        </tr>
                                        ${mailContentHtml}
                                    </table>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>`
    };

    let mailSendResult = await mailgun.messages().send(mailDataDefine);
    return {"success": true, "message": "应该是发送成功了."};
}
