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
            yield module.exports.log(`短信发送成功, ${JSON.stringify(optionObject)}`);
        });
    }, function(err){
        //发送失败
        co(function *() {
            yield module.exports.log(`短信发送失败, ${JSON.stringify(optionObject)}, `, err);
        });
    });
}

/* 添加Wanqu日报搜索内容的日志 */
// module.exports.wanquLog = function *(ip) {
module.exports.log = function *(ip) {
    let WanquLogObject = new LeanCloud.WanquLog();
    WanquLogObject.set('ip', ip);
    WanquLogObject.save();
}
