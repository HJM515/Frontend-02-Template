## 发布系统

### 线上服务器

1. 准备一个真实服务器或者本地虚拟机，安装 node 运行环境，作为线上服务器。
2. 利用 express 编写服务器代码，部署到线上服务器。

```
Oracle VM VirtualBox 下载地址： https://www.virtualbox.org/
Ubuntu 20.04.1 LTS (Focal Fossa) 下载地址：
  官网： https://releases.ubuntu.com/20.04/
  网盘： https://pan.baidu.com/s/1s8lga6YxuVcOdcAdhGQqoQ 
  提取码：b8yw
```

```
1. 本地使用 express 编写服务器代码
mkdir server
npx express-generator
npm install
npm start
只使用它作为静态资源服务器，因此可删除路由相关文件代码。保证public目录下文件正常访问即可。

2. scp 命令，将 server 文件内容拷贝到 线上服务器， npm start 即可启动服务。

虚拟机端口转发设置：将宿主机上的 8022 端口，转发到虚拟机的 22 端口。
```

### 发布系统

- publish-server 负责向真实的 server，copy 文件
- publish-tool 向 publish-server 发送想要发布的文件


流：

- writable 写入流，可同步调用，会排队写入。`writable.write(chunk[, encoding][,callback])` 返回true，表示可写。返回false，此次 write 有效，会被放入缓存中。
- pipe 将可读流导入可写流。即可以将 ReadStream 直接 pipe 到 request 中。

```
npm start 只有start可省略 run
npm start& 显示所有log (在服务器/虚拟机)
```

多文件上传：

- publish-tool 使用 anchiver 压缩文件 pipe 到 request
- publish-server 使用 unzipper 解压 request。

github 登录鉴权流程：

https://docs.github.com/en/free-pro-team@latest/developers/apps/authorizing-oauth-apps

1. github > settings > developSettings > new Github app
2. publish-tool：打开 GET https://github.com/login/oauth/authorize
3. publish-server：auth 路由，接收code, 用 code + client_id + client_secret 去换取 token
4. publish-tool：创建 server, 接收 token
5. publish-server：publish 路由，用token 获取用户信息，检查权限，发布

说一说坑：

1. /login/oauth/access_token 接口 返回的body总时空的。

打开授权页，重定向带的 code 是会过期的。如果有问题，需要重新运行 publish-tool，从登录流程头开始重试。

最后，重新new github app, 使用新的client_id, client_secret 就可以了（不知道是不是第一次建的app有问题）。

2. 获取用户信息的接口返回有误。

hostname 是 api.github.com， 不是 github.com。

3. 阿里云服务器，FinalShell 中，node 进程无法通过ctrl + c 结束。

```
ps -ef | grep node 查看进程
kill xxxx 杀死进程
```

