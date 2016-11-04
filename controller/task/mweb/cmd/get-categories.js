"use strict";

/* 返回博客类目信息 */
module.exports = () =>{
    return `<?xml version="1.0" encoding="UTF-8"?>
        <methodResponse>
            <params>
                <param>
                    <value>
                        <array>
                            <data>
                                <value>
                                    <struct>
                                        <member>
                                            <name>categoryId</name>
                                            <value>
                                                <string>1</string>
                                            </value>
                                        </member>
                                        <member>
                                            <name>parentId</name>
                                            <value>
                                                <string>0</string>
                                            </value>
                                        </member>
                                        <member>
                                            <name>description</name>
                                            <value>
                                                <string>Article</string>
                                            </value>
                                        </member>
                                        <member>
                                            <name>categoryDescription</name>
                                            <value>
                                                <string>这些可能是有史以来, 最屌的一些文章了.(太臭不要脸了..)</string>
                                            </value>
                                        </member>
                                        <member>
                                            <name>categoryName</name>
                                            <value>
                                                <string>屌炸天的文章</string>
                                            </value>
                                        </member>
                                        <member>
                                            <name>htmlUrl</name>
                                            <value>
                                                <string>http://bigyoo.me</string>
                                            </value>
                                        </member>
                                        <member>
                                            <name>rssUrl</name>
                                            <value>
                                                <string>http://bigyoo.me</string>
                                            </value>
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
