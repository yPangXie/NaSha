"use strict"

const path = require('path');
const koa = require('koa');
const router = require('koa-router')();
const views = require('koa-views');
const session = require('koa-session');

const app = koa();
const config = require('./config');
const task = require('./task');
const viewRoot = path.resolve(`${__dirname}/views`);

/* 中间件 */
app.use(function *(next) {
    this.state.staticTimestamp = Date.now();
    this.state.config = config;
    this.state.settings = {
        views: viewRoot
    };

    yield next;
});

/* session模块 */
app.keys = ['krabs-NaSha'];
app.use(session(app));

/* view模块 */
app.use(views(viewRoot, {
    cache: false,
    extension: 'dust'
}));

/* 路由 */
app.use(router.routes());

/* 初始化各种task */
app.use(task.home(router, config.routerPrefix));
app.use(task.weibo(router, config.routerPrefix));
app.use(task.commander(router, config.routerPrefix));

app.listen(config.port);
