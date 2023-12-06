const router = require("express").Router();
const userController = require("../controllers/userController");
const homeController = require("../controllers/homeController");

router.get("/login", userController.login); // Render the login page

router.post("/login", userController.authenticate); // Authenticate user login

router.get("/logout", userController.logout, homeController.redirectView); // Log out the user

router.get("/", userController.checkLoggedIn, userController.index, userController.indexView); // Render the users page

router.get("/signup", userController.signup); // Render the signup page

router.post("/create", userController.validate, userController.create, homeController.redirectView); // Create a new user

router.get("/:id", userController.checkLoggedIn, userController.show, userController.showView); // Show details of a specific user

router.get("/:id/edit", userController.checkLoggedIn, userController.edit); // Show edit page for a specific user

router.put("/:id/update", userController.checkLoggedIn, userController.update, homeController.redirectView); // Update a specific user to database

router.delete("/:id/delete", userController.checkLoggedIn, userController.delete, homeController.redirectView); // Delete a specific user from database

module.exports = router;
