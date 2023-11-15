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
app.listen(app.get("port"), async () => {
  await setup.addEventsToDatabase();
  await setup.addSampleJobsToDatabase();
  console.log(`Server running at http://localhost:${app.get("port")}`);
});

// Set-up MongoDB connection
var address = process.env.DB_ADDRESS || "mongodb://127.0.0.1:27017/brandeis_saa";
mongoose.connect(address);
console.log("address: " + address)
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


// Set up all routes

app.use("/", router);

// Middleware to add user to response locals
const setUserLocals = (req, res, next) => {
  res.locals.user = req.session.user
  next();
};

// Middleware to set user locals
router.use(setUserLocals);

// Home Routes
router.get("/", homeController.respondWithIndex); // Render the home page

router.get("/index", homeController.respondWithIndex); // Render the home page

router.get("/about", homeController.respondWithAbout); // Render the about page

router.get("/contact", homeController.respondWithContact); // Render the contact page


// Event Routes
router.get("/events", eventController.getEvents, homeController.redirectView); // Render events page

router.get("/events/create", userController.checkLoggedIn, eventController.create); // Show create event page if user is logged in

router.post("/events/add", eventController.add, homeController.redirectView); // Add a new event

router.get("/events/:id", eventController.show, eventController.showView); // Show details of a specific event

router.get("/events/:id/edit", eventController.edit); // Show edit page for a specific event

router.put("/events/:id/update", eventController.update, homeController.redirectView); // Update a specific event to database

router.delete("/events/:id/delete", eventController.delete, homeController.redirectView); // Delete a specific event frrom database

router.post("/events/attend", userController.checkLoggedIn, eventController.attend); // Attend an event if user is logged in (adds to attendees array in database)


// Job Routes
router.get("/jobs", jobController.getJobs); // Render jobs page

router.get("/jobs/create", userController.checkLoggedIn, jobController.create); // Show create job page if user is logged in

router.post("/jobs/add", jobController.add, homeController.redirectView); // Add a new job

router.get("/jobs/:id", jobController.show, jobController.showView); // Show details of a specific job

router.get("/jobs/:id/edit", jobController.edit); // Show edit page for a specific job

router.put("/jobs/:id/update", jobController.update, homeController.redirectView); // Update a specific job to database

router.delete("/jobs/:id/delete", jobController.delete, homeController.redirectView); // Delete a specific job from database

router.post("/jobs/apply", userController.checkLoggedIn, jobController.apply); // Apply for a job if user is logged in (adds to applicants array in database)


// User Routes
router.get("/login", userController.login); // Render the login page

router.post("/users/login", userController.authenticate, homeController.redirectView); // Authenticate user login

router.get('/logout', userController.logout); // Log out the user

router.get("/users", userController.index, userController.indexView); // Render the users page

router.get("/users/signup", userController.signup); // Render the signup page

router.post("/users/create", userController.create, homeController.redirectView); // Create a new user

router.get("/users/:id", userController.show, userController.showView); // Show details of a specific user

router.get("/users/:id/edit", userController.edit); // Show edit page for a specific user

router.put("/users/:id/update", userController.update, homeController.redirectView); // Update a specific user to database

router.delete("/users/:id/delete", userController.delete, homeController.redirectView); // Delete a specific user from database


// Error handlers
router.use(errorController.pageNotFoundError);
router.use(errorController.internalServerError);

module.exports = app;
