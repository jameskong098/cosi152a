var createError = require('http-errors');
var express = require('express');
var path = require('path');
const layouts = require("express-ejs-layouts")
var homeController = require('./controllers/homeController')
const errorController = require("./controllers/errorController");

// Initialize app
var app = express();

// Set-up port and connection
app.set("port", process.env.PORT || 8080);
app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});

// Set-up static layout (header + footer)
app.use(layouts)

// Use assets from public directory
app.use(express.static("public"))

// Set-up view engine (ejs)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Set up all routes

app.get("/", homeController.respondWithIndex)

app.get("/index", homeController.respondWithIndex);

app.get("/about", homeController.respondWithAbout);

app.get("/contact", homeController.respondWithContact);

app.get("/events", homeController.respondWithEvents);

app.get("/index", homeController.respondWithIndex);

app.get("/jobs", homeController.respondWithJobs);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);

module.exports = app;
