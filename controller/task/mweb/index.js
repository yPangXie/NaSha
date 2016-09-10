"use strict"

/* 暴露cmd方法 */
module.exports.cmd = {
    /* 返回基本的博客信息, 以完成验证 */
    "getUsersBlogs": require('./cmd/get-user-blogs'),
    /* 获取类目信息 */
    "getCategories": require('./cmd/get-categories'),
    /* 发布一篇文章 */
    "newPost": require('./cmd/new-post'),
    /* 修改一篇文章 */
    "editPost": require('./cmd/edit-post')
}

/* 暴露的定时方法 */
module.exports.timing = {}
