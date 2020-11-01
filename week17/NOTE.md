## mocha

https://mochajs.bootcss.com/

```
npm i -D mocha
test/test.js
npm test
```

兼容 ESM 模块

```
npm i -D @babel/core @babel/preset-env @babel/register

"scripts": {
    "test": "mocha --require @babel/register"
},
```

