const router = require("express").Router();
const homeController = require("../controllers/homeController");

router.get("/", homeController.respondHome);
router.get("/contact", homeController.showContact);
router.post("/contact", homeController.postedContactForm);
router.get("/chat", homeController.chat);

module.exports = router;
