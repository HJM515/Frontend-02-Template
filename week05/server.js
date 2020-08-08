const http = require("http");

http.createServer((req, res) => {
  let body = [];
    req.on('error', err => {
        console.log(err);
    }).on('data', chunk => {
        console.log("chunk", chunk.toString())
        body.push(chunk);
    }).on('end', () => {
        console.log("body", body)
        body = Buffer.concat(body).toString();
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(`
            <html lang="en">
                <head>
                    <meta charset="UTF-8" />
                    <title>Toy Browser</title>
                    <style>
                        #container{
                            display: flex;
                            width: 500px;
                            height: 300px;
                            background-color: rgb(0, 255, 255);
                        }
                        #id1{
                            width: 200px;
                            height: 100px;
                            background-color: rgb(255, 0, 0);
                        }
                        .class1{
                            flex: 1;
                            background-color: rgb(0, 255, 0);
                        }
                    </style>
                </head>
                <body>
                    <div id="container">
                        <div id="id1"></div>
                        <div class="class1"></div>
                    </div>
                </body>
            </html>
        `)
    })
}).listen(3000);

console.log('server started')

