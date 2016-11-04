"use strict";

const co = require('co');
const LeanCloud = require('./initialize');

/* 发送短信通知 */
module.exports.sms = async options => {
    if(!LeanCloud.secret.phoneNumber || !options) return false;

    let optionObject = {
        "mobilePhoneNumber": LeanCloud.secret.phoneNumber
    };
    for(let key in options) {
        optionObject[key] = options[key];
    }

    LeanCloud.AV.Cloud.requestSmsCode(optionObject).then(async () => {
        //发送成功
        await module.exports.applog(`短信发送成功, ${JSON.stringify(optionObject)}`);
    }, async (err) => {
        //发送失败
        await module.exports.applog(`短信发送失败, ${JSON.stringify(optionObject)}, `, err);
    });
};

/* 添加应用操作日志 */
module.exports.applog = async message => {
    let AppLogObject = new LeanCloud.AppLog();
    AppLogObject.set('message', message);
    AppLogObject.save();
};
