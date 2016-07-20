"use strict";

const mwebUtil = require('../mweb-util');

/* 返回博客基本信息 */
module.exports = function *(ctx) {
    let userValidate = mwebUtil.validateUser(ctx.request.body);
    if(!userValidate.success) return this.body = '';

    return `<?xml version="1.0" encoding="ISO-8859-1"?>
        <methodResponse>
            <params>
                <param>
                    <value>
                        <array>
                            <data>
                                <value>
                                    <struct>
                                        <member>
                                            <name>url</name>
                                            <value>http://bigyoo.com</value>
                                        </member>
                                        <member>
                                            <name>blogid</name>
                                            <value>0703</value>
                                        </member>
                                        <member>
                                            <name>blogName</name>
                                            <value>Mr.Krabs home</value>
                                        </member>
                                    </struct>
                                </value>
                            </data>
                        </array>
                    </value>
                </param>
            </params>
        </methodResponse>`;
}
