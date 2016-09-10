"use strict"

/* 路由 */
const authorize = require('./authorize');
const home = require('./home');

module.exports = function(router, routerPrefix) {
    router.get(`${routerPrefix}/weibo/authorize`, authorize);
    router.get(`${routerPrefix}/weibo`, home);

    return function *() {
        this.session.weibo = {};
    }
};

/* 暴露cmd方法 */
module.exports.cmd = require('./cmd');
