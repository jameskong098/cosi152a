const port = 8080;
const http = require("http");
const statusCodes = require("http-status-codes");

const app = http.createServer((req, res) => {
    console.log("An incoming request received");
    res.writeHead(statusCodes.OK, { "content-type": "text/html" });
    let responseMessage = 
        `
            <html>
                <body style="background-color: blue;">
                    <p style="color: red">Welcome to my page!</p>
                </body>
            </html>
        `;
    res.write(responseMessage);
    res.end();
    console.log(`A response with content ${responseMessage} was sent`);
}).listen(port);
console.log(`The server has started and is listening on port number: ${port}`);

