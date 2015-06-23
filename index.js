/*
 * Author: yPangXie <pangxie.wdy@gmail.com>
 * Date: 2015-06-24
 * Des: koa中间件, 解析combo的URL
 */

"use strict";

const path = require('path');
const url = require('url');
const qs = require('querystring');
const fs = require('co-fs-extra');
const mime = require('mime');

module.exports = function *(opts) {
    var comboPrefixes = opt.prefixes || [];
    var staticBase = opts.base || '';

    return function *(next){
        var parsedURL = url.parse(this.url);
        var pathname = parsedURL.pathname;
        var query = parsedURL.query ? parsedURL.query.replace(/\s/g, '') : '';
        var codes = [];

        for(var i = 0, len = comboPrefixes.length; i < len; i++) {
            var comboItem = comboPrefixes[i];
            var regPathname = new RegExp(comboItem + '$', 'g');
            /* URL格式校验, 禁止包含'..' */
            if(regPathname.test(comboItem) && /^\?/.test(query) && !/\.\./g.test(this.url)) {
                var sourceList = query.replace('?', '').split(',');
                var extname = path.extname(sourceList[0]) || '.html';
                this.set('content-type', mime.lookup(extname));

                for(var j = 0, l = sourceList.length; j < l; j++) {
                    var sourceItem = sourceList[j];
                    var code = yield fs.readFile(path.join(staticBase, comboItem, sourceItem));
                    codes.push(new Buffer(code).toString());
                }
            };
        }

        if(codes.length > 0) {
            this.body = codes.join('\n');
        } else {
            yield next;
        }
    }
}
