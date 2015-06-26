/*
 * Author: yPangXie <pangxie.wdy@gmail.com>
 * Date: 2015-06-26
 * Des: koa中间件, 解析combo的URL: 测试
 */

"use strict";

const path = require('path');
const assert = require("assert")
const should = require('should');
const request = require('supertest');
const co = require('co');
const urllib = require('urllib');
const Static = require('koa-static');
const app = require('koa')();
const comboParse = require('../');

describe("Get data with combo url:", function() {
    app.use(comboParse({
        prefixes: ['/'],
        base: path.resolve(__dirname, './files')
    }));

    app.use(Static(path.resolve(__dirname, './files')));

    it("Response data from /??a.js,b.js&_=test should be empty", function(done) {
        request(app.listen()).get('/??a.js,b.js').expect('a\nb', done);
    });

    it("Response data from /??a.js,b.js should be 'ab'(data of a.js and b.js)", function(done) {
        request(app.listen()).get('/??a.js,b.js').expect('a\nb', done);
    });

    it("Response data from /?a.js,b.js should be 404", function(done) {
        request(app.listen()).get('/?a.js,b.js').expect(404, done);
    });

    it("Response data from /js/lib/??a.js,b.js should be 404", function(done) {
        request(app.listen()).get('/js/lib/??a.js,b.js').expect(404, done);
    });
});
