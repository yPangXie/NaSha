/* workflow的leancloud接口测试 */

"use strict";

const request = require('request');
const mocha = require('co-mocha');
const should = require('should');
const model = require('../model').leanCloud;

describe('Workflows', function() {
    describe('get the total number of all the workflows', function () {
        it('Total number should be an number.', function *() {
            let totalNumberInfo = yield model.workflows.getCurrentLatestTotal();
            totalNumberInfo.should.be.an.Object().and.not.empty();
            (+totalNumberInfo.get('latestTotal')).should.be.an.Number();
        });
    });
    describe('get total number of daily issues grabed by spider', function () {
        it('Total number should be an number.', function *() {
            let dailyCount = yield model.workflows.spiderDaily();
            (+dailyCount).should.be.an.Number();
        });
    });
});
