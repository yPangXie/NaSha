"use strict";

module.exports.log = require('./log');
module.exports.leanCloud = require('./leancloud/leancloud');
module.exports.decodeData = (data) => {
    try {
        return decodeURIComponent(data);
    } catch(e) {
        return data;
    }
}
module.exports.getIP = (ctx) => {
    try {
        return ctx.req.headers['x-forwarded-for'] ||
               ctx.req.connection.remoteAddress ||
               ctx.req.socket.remoteAddress ||
               ctx.req.connection.socket.remoteAddress;
    } catch(e) {
        return '';
    }
}
