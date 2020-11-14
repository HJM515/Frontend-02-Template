##  git-hooks

```
.git/hooks 目录

touch pre-commit
ls -l ./pre-commit 查看权限
chmod +x ./pre-commit 增加执行权限

./git/hooks/pre-commit 目录
#!/usr/bin/env node
具体操作...

./pre-commit 执行文件
```

## eslint

```
npm i -D eslint

npx eslint --init 初始化 eslint 配置文件
```

eslint 与 hooks 结合，完成提交前的代码检查工作。

```js
// .git/hook/pre-commit
#!/usr/bin/env node
let process = require('process');
let child_process = require('child_process');
const { ESLint } = require('eslint');

function exec(name) {
    return new Promise((resolve) => {
        child_process.exec(name, resolve);
    })
}

(async function main() {
    // 1. Create an instance.
    const eslint = new ESLint();

    await exec('git stash push -k');
    // 2. Lint files.
    const results = await eslint.lintFiles(["index.js"]);
    await exec('git stash pop');

    // 3. Format the results.
    const formatter = await eslint.loadFormatter("stylish");
    const resultText = formatter.format(results);

    // 4. Output it.
    console.log(resultText);

    for(let result of results) {
        if(result.errorCount) {
            process.exitCode = 1;
        }
    }
})().catch((error) => {
    process.exitCode = 1;
    console.error(error);
});
```

## 使用无头浏览器检查DOM

PhantomJS 过于老旧。最佳实践：chrome 推出的 headless 模式。

https://developers.google.cn/web/updates/2017/04/headless-chrome?hl=en

Puppeteer 是一个 Node 库，它提供了一个高级 API 来通过 DevTools 协议控制 Chromium 或 Chrome。Puppeteer 默认以 headless 模式运行，但是可以通过修改配置文件运行“有头”模式。

基于lint 和 无头浏览器，可以构建一个强有力的持续集成体系。？？（不过感觉还是不太会呀）