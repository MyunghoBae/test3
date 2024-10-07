const http = require('http');
const fs = require('fs');

let data = "";

function handleRequest(req, res) {
    if (req.url === '/') {
        fs.readFile('index.html', 'utf8', function(err, content) {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            } else {
                data = content;
                fs.readFile('data.json', 'utf8', function(err, jsonData) {
                    if (err) {
                        res.writeHead(500, { 'Content-Type': 'text/plain' });
                        res.end('Internal Server Error');
                    } else {
                        try {
                            JSON.parse(jsonData);
                        } catch (e) {
                            res.writeHead(400, { 'Content-Type': 'text/plain' });
                            res.end('Bad Request');
                        }
                        res.writeHead(200, { 'Content-Type': 'text/html' });
                        res.end(data);
                    }
                });
            }
        });
    } else if (req.url === '/save') {
        let body = "";
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            fs.writeFile('output.txt', body, (err) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'text/plain' });
                    res.end('Internal Server Error');
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/plain' });
                    res.end('Data saved');
                }
            });
        });
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
}

http.createServer(handleRequest).listen(3000, function() {
    console.log("Server listening on: http://localhost:3000");
});
