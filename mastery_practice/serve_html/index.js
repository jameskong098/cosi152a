const fs = require("fs");
const port = 3000;
const http = require("http");
const httpStatus = require("http-status-codes");

const router = require("./router");
const plainTextContentType = {
  "Content-Type": "text/plain",
};
const htmlContentType = {
  "Content-Type": "text/html",
};

const customReadFile = (file, res) => {
  fs.readFile(`./${file}`, (error, data) => {
    if (error) {
      console.log("Error reading the file");
    }
    res.end(data);
  });
};

router.get("/", (req, res) => {
  res.writeHead(httpStatus.OK, plainTextContentType);
  res.end("INDEX");
});

router.get("/index.html", (req, res) => {
  res.writeHead(httpStatus.OK, htmlContentType);
  customReadFile("views/index.html", res);
});

router.get("/resume.html", (req, res) => {
  res.writeHead(httpStatus.OK, htmlContentType);
  customReadFile("views/resume.html", res);
});

router.get("/jobs.html", (req, res) => {
  res.writeHead(httpStatus.OK, htmlContentType);
  customReadFile("views/jobs.html", res);
});

router.post("/", (req, res) => {
  res.writeHead(httpStatus.OK, plainTextContentType);
  res.end("POSTED");
});

http.createServer(router.handle).listen(port);
console.log(`The server is listening on port number: ${port}`);
