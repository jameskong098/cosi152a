const port = 8080;
const http = require("http");
const router = require("./router")

const app = http.createServer(router.handle).listen(port);
console.log(`The server is listening on port number: ${port}`)