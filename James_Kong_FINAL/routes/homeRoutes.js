const router = require("express").Router();
const homeController = require("../controllers/homeController");

router.get("/", homeController.respondWithIndex); // Render the home page

router.get("/index", homeController.respondWithIndex); // Render the home page

router.get("/about", homeController.respondWithAbout); // Render the about page

router.get("/contact", homeController.respondWithContact); // Render the contact page

router.get("/chat", homeController.chat);

module.exports = router;
