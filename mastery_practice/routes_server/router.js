const httpStatus = require("http-status-codes"),
    htmlContentType = {
        "Content-Type": "text/html"
    },
    routes = {
        "GET": {
            "/": (req,res) => {
                res.writeHead(httpStatus.OK, {
                    "Content-Type": htmlContentType
                })
                res.end("<p>Welcome to my web page!</p>")
            },
            "/resume.html": (req, res) => {
                res.writeHead(httpStatus.OK, {
                    "Content-Type": htmlContentType
                })
                res.end("<p>Here is my resume!</p>")
            },
            "/jobs.html": (req, res) => {
                res.writeHead(httpStatus.OK, {
                    "Content-Type": htmlContentType
                })
                res.end("<p>Here are my jobs!</p>")
            }
        }
    };

    module.exports.handle = (req, res) => {
        try {
            if (routes[req.method][req.url]) {
                routes[req.method][req.url](req, res);
            } else {
                res.writeHead(httpStatus.NOT_FOUND, htmlContentType);
                res.end("<h1>No such file exists</h1>");
            }
        } catch (ex) {
            console.log("error: " + ex);
        }
    }

    module.exports.get = (url, action) => {
        routes["GET"][url] = action;
    }
