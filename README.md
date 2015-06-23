# koa-combo-parse

一个简单的koa中间件, 用于解析combo的url.

## 栗子

```javascript
const path = require('path');
const app = require('koa')();
const comboParse = require('koa-combo-parse');

app.use(comboParse({
    // combo前缀(数组)
    prefixes: ['/js/lib'],
    // 静态资源根目录
    base: path.resolve(__dirname, './htdocs')
}));
```

`http://www.ooxx.com/js/lib/??jquery.min.js,bootstrap.min.js,dust-full.js`

解析为

 - `http://www.ooxx.com/js/lib/jquery.min.js`
 - `http://www.ooxx.com/js/lib/bootstrap.min.js`
 - `http://www.ooxx.com/js/lib/dust-full.js`

读取三个文件的数据, 合并之后返回
