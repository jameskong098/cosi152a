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
const expressValidator = require("express-validator");
const passport = require("passport");
const User = require("./models/user");
const setup = require("./setup")

// Initialize app
var app = express();

const router = express.Router();

// Set-up port and connection
app.set("port", process.env.PORT || 8080);

const server = app.listen(app.get("port"), async () => {
  await setup.addEventsToDatabase();
  await setup.addSampleJobsToDatabase();
  console.log(`Server running at http://localhost:${app.get("port")}`);
});

const io = require("socket.io")(server);
require("./controllers/chatController")(io);

// Set-up MongoDB connection
var address = process.env.DB_ADDRESS || "mongodb://127.0.0.1:27017/brandeis_saa";
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

router.use(expressValidator());
router.use(passport.initialize());
router.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
router.use((req, res, next) => {
  res.locals.flashMessages = req.flash();
  res.locals.loggedIn = req.isAuthenticated();
  res.locals.currentUser = req.user;
  next();
});

// Set up all routes

app.use("/", router);

// Home Routes
router.get("/", homeController.respondWithIndex); // Render the home page

router.get("/index", homeController.respondWithIndex); // Render the home page

router.get("/about", homeController.respondWithAbout); // Render the about page

router.get("/contact", homeController.respondWithContact); // Render the contact page

router.get("/chat", homeController.chat);

// Event Routes
router.get("/events", eventController.getEvents, homeController.redirectView); // Render events page

router.get("/events/create", userController.checkLoggedIn, eventController.validate, eventController.create); // Show create event page if user is logged in

router.post("/events/add", userController.checkLoggedIn, eventController.add, homeController.redirectView); // Add a new event

router.get("/events/:id", eventController.show, eventController.showView); // Show details of a specific event

router.get("/events/:id/edit", userController.checkLoggedIn, eventController.edit); // Show edit page for a specific event

router.put("/events/:id/update", userController.checkLoggedIn, eventController.update, homeController.redirectView); // Update a specific event to database

router.delete("/events/:id/delete", userController.checkLoggedIn, eventController.delete, homeController.redirectView); // Delete a specific event frrom database

router.put("/events/attend", userController.checkLoggedIn, eventController.attend); // Attend an event if user is logged in (adds to attendees array in database)


// Job Routes
router.get("/jobs", jobController.getJobs, homeController.redirectView); // Render jobs page

router.get("/jobs/create", userController.checkLoggedIn, jobController.validate, jobController.create); // Show create job page if user is logged in

router.post("/jobs/add", userController.checkLoggedIn, jobController.add, homeController.redirectView); // Add a new job

router.get("/jobs/:id", jobController.show, jobController.showView); // Show details of a specific job

router.get("/jobs/:id/edit", userController.checkLoggedIn, jobController.edit); // Show edit page for a specific job

router.put("/jobs/:id/update", userController.checkLoggedIn, jobController.update, homeController.redirectView); // Update a specific job to database

router.delete("/jobs/:id/delete", userController.checkLoggedIn, jobController.delete, homeController.redirectView); // Delete a specific job from database

router.put("/jobs/apply", userController.checkLoggedIn, jobController.apply); // Apply for a job if user is logged in (adds to applicants array in database)


// User Routes
router.get("/users/login", userController.login); // Render the login page

router.post("/users/login", userController.authenticate); // Authenticate user login

router.get("/users/logout", userController.logout, homeController.redirectView); // Log out the user

router.get("/users", userController.checkLoggedIn, userController.index, userController.indexView); // Render the users page

router.get("/users/signup", userController.signup); // Render the signup page

router.post("/users/create", userController.validate, userController.create, homeController.redirectView); // Create a new user

router.get("/users/:id", userController.checkLoggedIn, userController.show, userController.showView); // Show details of a specific user

router.get("/users/:id/edit", userController.checkLoggedIn, userController.edit); // Show edit page for a specific user

router.put("/users/:id/update", userController.checkLoggedIn, userController.update, homeController.redirectView); // Update a specific user to database

router.delete("/users/:id/delete", userController.checkLoggedIn, userController.delete, homeController.redirectView); // Delete a specific user from database


// Error handlers
router.use(errorController.pageNotFoundError);
router.use(errorController.internalServerError);

module.exports = app;
