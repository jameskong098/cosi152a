var createError = require('http-errors');
var express = require('express');
var path = require('path');

const layouts = require("express-ejs-layouts")

var homeController = require('./controllers/homeController')

var app = express();

const port = 8080
app.listen(port)
console.log(`The server is listening on port number: ${port}`)

app.use(layouts)
app.use(express.static("public"))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', function(req, res, next) {
  res.render('index');
});

app.get('/index', function(req, res, next) {
    res.render('index')
});

app.get('/about', function(req, res, next) {
    res.render('about')
});

app.get('/contact', function(req, res, next) {
    res.render('contact')
});

app.get("/name/:myName", homeController.respondWithName);

app.get("/book/:id/:price", homeController.respondWithBook);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
