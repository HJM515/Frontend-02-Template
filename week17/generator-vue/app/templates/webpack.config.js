const VueLoaderPlugin = require("vue-loader/lib/plugin");
const CopyPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
  entry: "./src/main.js",
  output: { 
    path: path.resolve(__dirname, 'dist'), // 文件路径必须是绝对路径
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: { loader: "vue-loader" },
      },
      // 它会应用到普通的 `.css` 文件
      // 以及 `.vue` 文件中的 `<style>` 块
      {
        test: /\.css$/,
        use: ["vue-style-loader", "css-loader"],
      },
      {
        test: /\.js$/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      }
    ],
  },
  plugins: [
    // 请确保引入这个插件！
    new VueLoaderPlugin(),

    new CopyPlugin({
      patterns: [{ from: "public" }],
    }),
  ],
};
