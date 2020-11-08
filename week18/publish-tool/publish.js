const http = require('http');
const fs = require('fs');
const archiver = require('archiver');
const child_process = require('child_process');
const querystring = require('querystring');

// 1. 打开 https://github.com/login/oauth/authorize
child_process.exec(
    'start https://github.com/login/oauth/authorize?client_id=Iv1.b91d2ecf32117796',
    (error, stdout, stderr) => {
        console.log(error)
    }
)

// 3. 创建 server, 接收 token
http.createServer((req, res) => {
    let query = querystring.parse(req.url.match(/^\/\?([\s\S]+)$/)[1])
    console.log("query", query)
    publish(query.token)
}).listen(3001)

function publish (token) {
    const req = http.request({
        // hostname: 'xx.xx.xx.xx',
        hostname: '127.0.0.1',
        port: 3000,
        method: 'POST',
        path: '/publish?token=' + token,
        headers: {
            'Content-Type': 'application/octet-stream'
        }
    }, res => {
        console.log(res)
    })

    const archive = archiver('zip', {
        zlib: { level: 9 } // Sets the compression level.
    });
    archive.directory('./sample', false);
    archive.finalize();
    archive.pipe(req);

    req.on('end', () => {
        console.log('success')
    })
}

