"use strict";

const AV = require('avoscloud-sdk');
const leanCloudSecret = require('./.secret');
AV.initialize(leanCloudSecret.workflow.appId, leanCloudSecret.workflow.appKey);

/* 添加workflow */
module.exports.addWorkflow = function *(options) {
    let Workflows = AV.Object.extend('Workflows');
    let WorkflowsObject = new Workflows();

    for(let key in options) {
        WorkflowsObject.set(key, options[key]);
    }

    WorkflowsObject.save();
}
