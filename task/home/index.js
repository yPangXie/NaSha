"use strict"

const home = require('./home');

/* 路由 */
module.exports = function(router, routerPrefix) {
    router.get(`${routerPrefix}`, home);

    return function *() {
        this.session.weibo = {};
    }
};
