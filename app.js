"use strict"

const dust = require('dustjs-helpers');
const path = require('path');
const Koa = require('koa');
const app = new Koa();
const router = require('koa-router')();
const views = require('koa-views');
const session = require('koa-session');
const Static = require('koa-static');
const xmlParser = require('koa-xml-body').default;
const config = require('./.config');
const controller = require('./controller');
const viewRoot = path.resolve(`${__dirname}/views`);

/* 将部分数据挂载到全局变量 */
global.__nasha = {
    "APP_ROOT": __dirname,
    "APP_CONTROLLER": `${__dirname}/controller`,
    "APP_MODEL": `${__dirname}/model`,
    "APP_CACHE": require('memory-cache')
};

/* 中间件 */
app.use(async (ctx, next) => {
    ctx.state.staticTimestamp = Date.now();
    ctx.state.config = config;
    ctx.state.settings = {
        "views": viewRoot
    };

    await next();
});

/* session模块 */
app.keys = ['krabs-NaSha'];
app.use(session(app));

app.use(Static(path.resolve(__dirname, './assets')));

/* view模块 */
app.use(views(viewRoot, {
    cache: false,
    extension: 'dust'
}));
/* 不启用模板压缩 */
dust.config.whitespace = true;
dust.config.cache = false;

/* 解析xml类型的请求 */
app.use(xmlParser());

/* 路由 */
app.use(router.routes());

/* 初始化各种模块 */
app.use(controller.home(router, config.routerPrefix));
app.use(controller.weibo(router, config.routerPrefix));
app.use(controller.rpc(router, config.routerPrefix));

app.listen(config.port, function() {
    console.log(`Server start with port ${config.port}`);
});
