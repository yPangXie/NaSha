"use strict";

const AV = require('avoscloud-sdk');
const leanCloudSecret = process.env.NODE_ENV == 'ci' ? require('../.config.travis').leanCloud : require('../.config').leanCloud;
AV.initialize(leanCloudSecret.appId, leanCloudSecret.appKey);

module.exports.AV = AV;
module.exports.Wanqu = AV.Object.extend('Wanqu');
module.exports.Workflows = AV.Object.extend('Workflows');
module.exports.WanquLog = AV.Object.extend('WanquLog');
module.exports.WanquInfo = AV.Object.extend('WanquInfo');
module.exports.WanquTiming = AV.Object.extend('WanquTiming');
module.exports.WanquUsers = AV.Object.extend('WanquUsers');
module.exports.WorkflowTiming = AV.Object.extend('WorkflowTiming');
module.exports.AppLog = AV.Object.extend('AppLog');
module.exports.MWeb = AV.Object.extend('MWeb');
module.exports.Read = AV.Object.extend('Read');
module.exports.secret = leanCloudSecret;
