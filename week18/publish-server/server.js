const http = require('http');
const https = require('https');
// const fs = require('fs');
const unzipper = require('unzipper');
const querystring = require('querystring');

// 2. 接收code, 用 code + client_id + client_secret 去换取 token
function auth(req, res) {
    let query = querystring.parse(req.url.match(/^\/auth\?([\s\S]+)$/)[1]);
    getToken(query.code, (info) => {
        res.write(`
            <a href="http://localhost:3001/?token=${info.access_token}">
                publish
            </a>
        `);
        res.end();
    })
}

function getToken(code, callback) {
    let req = https.request({
        hostname: 'github.com',
        path: `/login/oauth/access_token?code=${code}&client_id=Iv1.b91d2ecf32117796&client_secret=7165e9d50b1da87dfa09633a33a18b66621991e0`,
        method: 'POST',
        port: 443
    }, res => {
        let body = ''
        res.on('data', chunk => {
            body += chunk.toString()
            console.log(body)
        })
        res.on('end', () => {
            callback(querystring.parse(body));
        })
    })
    req.end();
}

// 4. 用token 获取用户信息，检查权限，接收发布
function publish(req, res) {
    let query = querystring.parse(req.url.match(/^\/publish\?([\s\S]+)$/)[1]);
    getUser(query.token, info => {
        if(info.login === 'HJM515') {
            console.log('权限验证通过')
            req.pipe(unzipper.Extract({ path: '../server/public' }))
        }else{
            console.log('你没有权限')
        }
        req.on('end', () => {
            res.end('success')
        })
    })
}

function getUser(token, callback) {
    let req = https.request({
        hostname: 'api.github.com',
        path: '/user',
        method: 'GET',
        port: 443,
        headers: {
            Authorization: `token ${token}`,
            'User-Agent': 'Toy-Publish'
        }
    }, res => {
        let body = ''
        res.on('data', chunk => {
            body += chunk.toString()
        })
        res.on('end', () => {
            console.log('body', body)
            callback(JSON.parse(body));
        })
    })
    req.end();
}

http.createServer((req, res) => {
    if(req.url.match(/^\/auth\?/)) {
        return auth(req, res)
    }else if(req.url.match(/^\/publish\?/)) {
        return publish(req, res)
    }
}).listen(3000)