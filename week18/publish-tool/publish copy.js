const http = require('http');
const fs = require('fs');
const archiver = require('archiver');
const archive = archiver('zip', {
    zlib: { level: 9 } // Sets the compression level.
});

archive.directory('./sample', false);
archive.finalize();

archive.pipe(fs.createWriteStream('tmp.zip'))

fs.stat('./sample', (err, stats) => {
    const request = http.request({
        hostname: '47.96.73.17',
        port: 3000,
        method: 'POST',
        headers: {
            'Content-Type': 'application/octet-stream',
            'Content-Length': stats.size
        }
    }, response => {
        console.log(response)
    })
    
    const file = fs.createReadStream('./sample.html');
    
    // pipe 将可读流 导入 可写流，request 是可写流。
    file.pipe(request);
    
    file.on('end', () => request.end());
})

// file.on('data', chunk => {
//     console.log(chunk.toString())
//     request.write(chunk)
// })
// file.on('end', () => {
//     console.log('end')
//     request.end()
// })
