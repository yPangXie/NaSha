"use strict"

const home = require('./home');

/* 路由 */
module.exports = function(router, routerPrefix) {
    router.get(`${routerPrefix}/read`, home);

    return function *() {
        this.session.weibo = {};
    }
};
