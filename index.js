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
const debug = require('debug')('koa-combo-parse');

module.exports = function(opts) {
    var staticBase = opts.base || '';

    return function *(next){
        var parsedURL = url.parse(this.url);
        var pathname = parsedURL.pathname;
        var query = cleanQuery(parsedURL.query ? parsedURL.query.replace(/\s/g, '') : '');

        debug('query: %s', query);
        debug('pathname: %s', pathname);
        var codes = [];

        /* URL格式校验, 禁止包含'..' */
        if(/^\?/.test(query) && !/\.\./g.test(this.url)) {
            var sourceList = query.replace('?', '').split(',');
            var extname = path.extname(sourceList[0]) || '.html';
            this.set('content-type', mime.lookup(extname));
            debug("extname: %s, mime: %s", extname, mime.lookup(extname));
            for(var j = 0, l = sourceList.length; j < l; j++) {
                var sourceItem = sourceList[j];
                try {
                    var code = yield fs.readFile(path.join(staticBase, pathname, sourceItem));
                } catch(e) {
                    continue;
                }

                codes.push(new Buffer(code).toString());
            }
        };

        if(codes.length > 0) {
            this.body = codes.join('\n');
        } else {
            yield next;
        }
    }

    /* 提取url query中以?开头的数据 */
    function cleanQuery(query) {
        if(!query) {
            return '';
        }

        var queryArray = query.split('&');
        for(var i = 0, len = queryArray.length; i < len; i++) {
            var queryItem = decodeURIComponent(queryArray[i]).replace('=', '');
            if(/^\?/g.test(queryItem)) {
                debug('matched query: %s', queryItem) ;
                return queryItem;
            }
        }

        return '';
    }
}
