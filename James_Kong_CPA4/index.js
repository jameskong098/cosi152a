const port = 8080;
const http = require("http");
const httpStatus = require("http-status-codes");

const router = require("./router");
const contentType = require("./public/js/contentType")
const util = require("./public/js/utils")

router.get("/", (req, res) => {
  res.writeHead(httpStatus.OK, contentType.htmlContentType);
  util.customReadFile("views/index.html", res);
});

router.get("/style.css", (req, res) => {
  res.writeHead(httpStatus.OK, contentType.cssContentType);
  util.customReadFile("public/css/style.css", res);
});

router.get("/BrandeisLogo.png", (req, res) => {
  res.writeHead(httpStatus.OK, contentType.pngContentType);
  util.customReadFile("public/images/BrandeisLogo.png", res);
});

router.get("/brandeis-alumni.png", (req, res) => {
  res.writeHead(httpStatus.OK, contentType.pngContentType);
  util.customReadFile("public/images/brandeis-alumni.png", res);
});

router.get("/alumni-1.png", (req, res) => {
  res.writeHead(httpStatus.OK, contentType.pngContentType);
  util.customReadFile("public/images/alumni-1.png", res);
});

router.get("/brandeis-alumni-2.jpg", (req, res) => {
  res.writeHead(httpStatus.OK, contentType.jpgContentType);
  util.customReadFile("public/images/brandeis-alumni-2.jpg", res);
});

router.get("/favicon-16x16.png", (req, res) => {
  res.writeHead(httpStatus.OK, contentType.faviContentType);
  util.customReadFile("public/images/favicon-16x16.png", res);
});

router.get("/index.html", (req, res) => {
  res.writeHead(httpStatus.OK, contentType.htmlContentType);
  util.customReadFile("views/index.html", res);
});

router.get("/about.html", (req, res) => {
  res.writeHead(httpStatus.OK, contentType.htmlContentType);
  util.customReadFile("views/about.html", res);
});

router.get("/jobs.html", (req, res) => {
  res.writeHead(httpStatus.OK, contentType.htmlContentType);
  util.customReadFile("views/jobs.html", res);
});

router.get("/events.html", (req, res) => {
  res.writeHead(httpStatus.OK, contentType.htmlContentType);
  util.customReadFile("views/events.html", res);
});

router.get("/contact.html", (req, res) => {
  res.writeHead(httpStatus.OK, contentType.htmlContentType);
  util.customReadFile("views/contact.html", res);
});

http.createServer(router.handle).listen(port);
console.log(`The server is listening on port number: ${port}`);
