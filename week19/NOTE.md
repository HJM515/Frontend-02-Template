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