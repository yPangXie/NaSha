"use strict"

/* 路由 */
const authorize = require('./authorize');
const home = require('./home');
const cmd = require('./cmd');

module.exports = function(router) {
    router.get('/weibo/authorize', authorize);
    router.get('/weibo', home);
    router.get('/weibo/cmd', cmd.autoNotice);

    return function *() {
        this.session.weibo = {};
    }
};
