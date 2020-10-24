## 工具链

### 初始化工具 - Yeoman

参考 https://yeoman.io/authoring/index.html

使用到的命令行：

```
npm install -g yo
mkdir generator-vue
yarn init -y
yarn add yeoman-generator

yarn link
mkdir vue-demo
yo vue 如果执行报错，多半是app/index.js 中代码有错误
```

```json
// package.json
{
  "name": "generator-name",
  "version": "0.1.0",
  "description": "",
  "files": [
    "app"
  ],
  "keywords": ["yeoman-generator"],
  "dependencies": {
    "yeoman-generator": "^1.0.0"
  }
}
```

```js
// generator-vue/app/index.js
const Generator = require('yeoman-generator');
const fs = require('fs');
const path = require('path');

// 读取templates目录下的所有文件路径
function getTemplates (templatesPath) {
  let result = [];

  function bfs(filesPath) {
    const stats = fs.statSync(filesPath);
    if(stats.isDirectory()) {
      const ret = fs.readdirSync(filesPath);
      ret.forEach(file => {
        bfs(path.join(filesPath, file));
      })
    }else if(status.isFile()){
      result.push(filesPath);
    }
  }

  // 使用path.resolve 保证路径安全
  bfs(path.resolve(__dirname, templatesPath));
  
  return result.map(item => {
    return item.split(templatesPath+'\\')[1]
  });
}

module.exports = class extends Generator {
    //  命令行交互
  async prompting() {
    this.answers = await this.prompt([
      {
        type: "input",
        name: "name",
        message: "Your project name",
        default: this.appname, // Default to current folder name
      }
    ]);
  }

  // 获取模板路径，将模板文件写入到指定目录
  writing() {
    const templates = getTemplates('templates');
    templates.forEach(file => {
      const context = file.includes('index.html') 
        ? { title: 'Templating with Yeoman' } 
        : {}
      this.fs.copyTpl(
        this.templatePath(file),
        this.destinationPath(file),
        context
      );
    })
  }

  // 自定义package.json
  initPkgJson () {
    // 获取的this.appname 存在一个问题， 当文件路径为 vue-demo 获取到的是 vue demo, 而这个作为package.json 中 name字段值，是不合法的。
    let name = this.answers.name;
    name = name.trim().replace(/\s/, '-');
    const pkgJson = {
      name: name,
      devDependencies: {
        "vue-template-compiler": "^2.6.10",
        "webpack": "^4.28.4",
        "webpack-cli": "^3.3.7"
      },
      dependencies: {
        vue: '^2.6.10'
      }
    };

    // Extend or create package.json file in destination path
    this.fs.extendJSON(this.destinationPath('package.json'), pkgJson);
  }

  // 安装依赖
  install() {
    this.npmInstall();
    this.npmInstall([
      'css-loader', 'vue-loader', 'copy-webpack-plugin', 'vue-style-loader'
    ], { 'save-dev': true });
  }
};

```

### webpack 

最终打包出js文件，然后使用html 引入这个js 文件。

全局安装使用：

```
npm install -g webpack webpack-cli
webpack
```

项目内使用：

```
npm install --save-dev webpack webpack-cli
npx webpack
```

### babel

npm install -g @babel/cli @babel/core

babel配置繁琐，因此babel 将一套一套的配置存成 presets。如 @babel/preset-env。

babel 常用的方式是结合 webpack 使用。但babel其实也可以作为一个独立的工具使用。

babel.config.js vs .babelrc

- babel.config.js 项目范围配置，执行babel 默认会去项目根目录寻找该文件。由于是全局配置，所以应用范围甚至可以包括 node_modules。
- babel.config.js 的缺点，不适合 Monorepos（一个仓库里包含多个包）。无法使其只是适用于一个特定的子包。
- .babelrc 文件级的配置。可以包的部分模块指定特殊的配置。搜索返回知道package.json目录所在文件夹位置，不继续往上找。指定名称的编译文件应该在这个目录，不然就直接跳过。
- 比如项目根目录下有一个.babelrc，两个子包中，babel的配置是完全无效的。