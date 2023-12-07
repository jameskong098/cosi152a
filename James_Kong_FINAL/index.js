var express = require('express');
var path = require('path');
const layouts = require("express-ejs-layouts")
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const connectFlash = require("connect-flash");
const expressSession = require("express-session");
const cookieParser = require("cookie-parser");
const expressValidator = require("express-validator");
const passport = require("passport");
const router = require("./routes/index");
const User = require("./models/user");
const setup = require("./setup")

// Initialize app
var app = express();

// Set-up MongoDB connection
var address = process.env.DB_ADDRESS || "mongodb://localhost:27017/brandeis_saa";
mongoose.connect(address);
const db = mongoose.connection;
db.once("open", () => {
  console.log("Connected to the database!");
});

// Set-up port and connection
app.set("port", process.env.PORT || 8080);

// Set-up view engine (ejs)
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// Set-up static layout (header + footer)
app.use(layouts)

// Use assets from public directory
app.use(express.static("public"))

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(
  methodOverride("_method", {
    methods: ["POST", "GET"],
  })
);

app.use(connectFlash());
app.use(
  expressSession({
    secret: "secret_passcode",
    cookie: { maxAge: 4000000 },
    resave: false,
    saveUninitialized: false,
  })
);

app.use(cookieParser("secret_passcode"));

app.use(expressValidator());
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  res.locals.loggedIn = req.isAuthenticated();
  res.locals.currentUser = req.user;
  next();
});

// Set up all routes

app.use("/", router);

const server = app.listen(app.get("port"), async () => {
  await setup.addEventsToDatabase();
  await setup.addSampleJobsToDatabase();
  console.log(`Server running at http://localhost:${app.get("port")}`);
});

const io = require("socket.io")(server);
require("./controllers/chatController")(io);

module.exports = app;
