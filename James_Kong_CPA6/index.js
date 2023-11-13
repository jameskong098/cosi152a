var express = require('express');
var path = require('path');
const layouts = require("express-ejs-layouts")
const mongoose = require("mongoose");
var homeController = require('./controllers/homeController')
var jobController = require('./controllers/jobController')
var eventController = require('./controllers/eventController')
var userController = require('./controllers/userController')
const errorController = require("./controllers/errorController");
const methodOverride = require("method-override");
const connectFlash = require("connect-flash");
const expressSession = require("express-session");
const cookieParser = require("cookie-parser");
const setup = require("./setup")

// Initialize app
var app = express();

const router = express.Router();

// Set-up port and connection
app.set("port", process.env.PORT || 8080);
app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});

// Set-up MongoDB connection
var address = process.env.DB_ADDRESS || "mongodb://localhost:27017/brandeis_saa";
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

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
router.use(
  methodOverride("_method", {
    methods: ["POST", "GET"],
  })
);
router.use(connectFlash());
router.use(
  expressSession({
    secret: "secret_passcode",
    cookie: { maxAge: 4000000 },
    resave: false,
    saveUninitialized: false,
  })
);
router.use(cookieParser("secret_passcode"));
router.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  next();
});

setup.addEventsToDatabase();
setup.addSampleJobsToDatabase();

// Set up all routes

app.use("/", router);

// Middleware to add user to response locals
const setUserLocals = (req, res, next) => {
  res.locals.user = req.session.user
  next();
};

router.use(setUserLocals)

router.get("/", homeController.respondWithIndex)

router.get("/index", homeController.respondWithIndex);

router.get("/about", homeController.respondWithAbout);

router.get("/contact", homeController.respondWithContact);

router.get("/events", eventController.getEvents);

router.post(
  "/attend", 
  userController.checkLoggedIn,
  eventController.attend,
);

router.get("/jobs", jobController.getJobs);

router.get("/login", userController.login)

router.post(
  "/users/login",
  userController.authenticate,
  userController.redirectView
);

router.get('/logout', userController.logout);

router.get("/users", userController.index, userController.indexView);

router.get("/users/signup", userController.signup)

router.post("/users/create", userController.create, userController.redirectView)

router.get("/users/:id", userController.show, userController.showView);

router.get("/users/:id/edit", userController.edit);

router.put(
  "/users/:id/update",
  userController.update,
  userController.redirectView
);

router.delete(
  "/users/:id/delete",
  userController.delete,
  userController.redirectView
);

// error handler
router.use(errorController.pageNotFoundError);
router.use(errorController.internalServerError);

module.exports = app;
