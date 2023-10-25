const mongoose = require("mongoose");
const express = require("express");
const homeController = require("./controllers/homeController");
const layouts = require("express-ejs-layouts");
const errorController = require("./controllers/errorController");
const Subscriber = require("./models/subscriber");
const subscribersController = require("./controllers/subscribersController");

//used to be "mongodb://localhost:27017/the_kitchen" but only IP would work on my windows PC
mongoose.connect("mongodb://127.0.0.1:27017/the_kitchen");
const db = mongoose.connection;
db.once("open", () => {
  console.log("Connected to the database!");
});

// let subscriber1 = new Subscriber({
//   name: "Jon",
//   email: "Jon@brandeis.edu",
//   zipCode: 12345,
// });

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

// subscriber1
//   .save()
//   .then((data) => {
//     console.log(data);
//   })
//   .catch((error) => {
//     if (error) console.log(error);
//   });

// var query = Subscriber.findOne({ name: "Test" }).where("email", /tes/);

// query
//   .exec()
//   .then((data) => {
//     console.log("The data is found!");
//     console.log(data);
//   })
//   .catch((error) => {
//     if (error) {
//       console.log(error);
//     }
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
