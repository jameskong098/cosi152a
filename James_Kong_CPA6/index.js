var express = require('express');
var path = require('path');
const layouts = require("express-ejs-layouts")
const mongoose = require("mongoose");
var homeController = require('./controllers/homeController')
const errorController = require("./controllers/errorController");

// Initialize app
var app = express();

// Set-up port and connection
app.set("port", process.env.PORT || 8080);
app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});

// Set-up MongoDB connection
var address = process.env.DB_ADDRESS || "mongodb://localhost:27017/the_kitchen";
mongoose.connect(address);
const db = mongoose.connection;
db.once("open", () => {
  console.log("Connected to the database!");
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

app.get("/jobs", homeController.respondWithJobs);

// error handler
app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);

module.exports = app;
