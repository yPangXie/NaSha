/* wanqu日报的leancloud接口测试 */

"use strict";

const request = require('request');
const mocha = require('co-mocha');
const should = require('should');
const model = require('../model').leanCloud;

describe('Wanqu', function() {
    describe('get latest issues', function () {
        it('data of latest issues should be an object and not empty.', function *() {
            let latestData = yield model.wanqu.getLatest();
            latestData.should.be.an.Object().and.not.empty();
        });
    });
    describe('get data of issue 100', function () {
        it('Data of issue 100 should be an object and not empty.', function *() {
            let specData = yield model.wanqu.getSpec("100");
            specData.should.be.an.Object().and.not.empty();
        });
    });
    describe('get number of the latest issue', function () {
        it('latest issue should be an number.', function *() {
            let latestIssueInfo = yield model.wanqu.getCurrentLatestIssue();
            latestIssueInfo.should.be.an.Object().and.not.empty();
            (+latestIssueInfo.get('latestIssue')).should.be.an.Number();
        });
    });
    describe('get total number of all the issues', function () {
        it('Total number should be an number.', function *() {
            let total = yield model.wanqu.total();
            (+total).should.be.an.Number();
        });
    });
    describe('get total number of daily issues grabed by spider', function () {
        it('Total number should be an number.', function *() {
            let dailyCount = yield model.wanqu.logDailyCount();
            (+dailyCount).should.be.an.Number();
        });
    });
    describe('get total number of issues grabed by spider after a spcific date', function () {
        it('Total number should be an number.', function *() {
            let spiderDaily = yield model.wanqu.spiderDaily(new Date('2016-10-01 00:00:00'));
            spiderDaily.length.should.be.an.Number();
        });
    });
});
