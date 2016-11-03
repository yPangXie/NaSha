"use strict"

const home = require('./home');

/* 路由 */
module.exports = function(router, routerPrefix) {
    router.get(`${routerPrefix}/read`, async (ctx, next) => {
        await home(ctx, next);
    });

    return function *() {
        this.session.weibo = {};
    }
};
