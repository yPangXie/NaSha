"use strict";

const co = require('co');
const LeanCloud = require('./initialize');

/* 发送短信通知 */
module.exports.sms = function *(options) {
    if(!LeanCloud.secret.phoneNumber || !options) return false;

    let optionObject = {
        "mobilePhoneNumber": LeanCloud.secret.phoneNumber
    };
    for(let key in options) {
        optionObject[key] = options[key];
    }

    LeanCloud.AV.Cloud.requestSmsCode(optionObject).then(function(){
        //发送成功
        co(function *() {
            yield module.exports.applog(`短信发送成功, ${JSON.stringify(optionObject)}`);
        });
    }, function(err){
        //发送失败
        co(function *() {
            yield module.exports.applog(`短信发送失败, ${JSON.stringify(optionObject)}, `, err);
        });
    });
}

/* 添加应用操作日志 */
module.exports.applog = function *(message) {
    let AppLogObject = new LeanCloud.AppLog();
    AppLogObject.set('message', message);
    AppLogObject.save();
}
