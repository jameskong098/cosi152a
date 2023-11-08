const mongoose = require("mongoose");
const express = require("express");
const homeController = require("./controllers/homeController");
const layouts = require("express-ejs-layouts");
const errorController = require("./controllers/errorController");
const Subscriber = require("./models/subscriber");
const Course = require("./models/course");

const subscribersController = require("./controllers/subscribersController");

mongoose.connect("mongodb://localhost:27017/the_kitchen");
const db = mongoose.connection;
db.once("open", () => {
  console.log("Connected to the database!");
});

let course1, subscriber1;
Course.findOne({})
  .then((course) => {
    course1 = course;
    return Subscriber.findOne({});
  })
  .then((subscriber) => {
    subscriber1 = subscriber;
    return Subscriber.populate(subscriber1, "courses");
  })
  .then((data) => {
    console.log(data);
  })
  .catch((error) => {
    console.error("An error occurred:", error);
  });

// Subscriber.create({
//   name: "Test",
//   email: "tes@brandeis.edu",
//   zipCode: 12345,
// })
//   .then((data) => {
//     console.log(data);
//   })
//   .catch((error) => {
//     if (error) console.log(error);
//   });

// Course.create({
//   title: "Object Oriented BBQ",
//   description: "This course is made using object oriented technique",
//   items: ["Meat", "Sault"],
//   zipCode: 12345,
// })
//   .then((data) => {
//     console.log(data);
//   })
//   .catch((error) => {
//     if (error) console.log(error);
//   });

const app = express();
app.set("view engine", "ejs");
app.use(layouts);
app.use(express.static("public"));

app.set("port", process.env.PORT || 3000);
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.get("/", homeController.respondHome);
app.get("/courses", homeController.showCourses);
app.get("/contact", homeController.showSignUp);
app.post("/contact", homeController.postedSignUpForm);
app.get("/subscribers", subscribersController.getAllSubscribers, (req, res) => {
  console.log(req.data);
  // res.send(req.data);
  res.render("subscribers", { subscribers: req.data });
});
app.get("/subscribe", subscribersController.getSubscriptionPage);
app.post("/subscribe", subscribersController.saveSubscriber);

app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);

app.listen(app.get("port"), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
