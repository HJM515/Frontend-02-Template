const Generator = require('yeoman-generator');
const fs = require('fs');
const path = require('path');

function getTemplates (templatesPath) {
  let result = [];

  function bfs(filesPath) {
    console.log("bfs -> filesPath", filesPath)
    const stats = fs.statSync(filesPath);
    if(stats.isDirectory()) {
      const ret = fs.readdirSync(filesPath);
      ret.forEach(file => {
        bfs(path.join(filesPath, file));
      })
    }else{
      result.push(filesPath);
    }
  }

  bfs(path.resolve(__dirname, templatesPath));

  return result.map(item => {
    return item.split(templatesPath+'\\')[1]
  });
}

module.exports = class extends Generator {
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

  initPkgJson () {
    const pkgJson = {
      name: this.answers.name,
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

  install() {
    this.npmInstall();
    this.npmInstall([
      'css-loader', 'vue-loader', 'copy-webpack-plugin', 'vue-style-loader'
    ], { 'save-dev': true });
  }
};
