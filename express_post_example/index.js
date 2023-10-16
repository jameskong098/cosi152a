const express = require("express");
const app = express();
var path = require('path');

app.set("port", process.env.PORT || 3000);
app.use(express.urlencoded({extended: false}));
app.use(express.json());

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static("public"))

const layouts = require("express-ejs-layouts")

app.use(layouts)

const homeController = require("./controllers/homeController")

app.get("/", (req, res) => {
    res.render(homeController.showHome);
});

app.get("/courses", homeController.showCourses);

app.get("/contact", homeController.showSignUp);

app.post("/contact", homeController.postedSignUpForm);

const errorController = require("./controllers/errorController");
app.use(errorController.pageNotFoundError);
app.use(errorController.internalServerError);

app.listen(app.get("port"), () => {
console.log(`Server running at http://localhost:${app.get("port")}`);
});
