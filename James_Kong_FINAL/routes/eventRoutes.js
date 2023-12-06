const router = require("express").Router();
const userController = require("../controllers/userController");
const eventController = require("../controllers/eventController");
const homeController = require("../controllers/homeController");

router.get("/", eventController.getEvents, homeController.redirectView); // Render events page

router.get("/create", userController.checkLoggedIn, eventController.validate, eventController.create); // Show create event page if user is logged in

router.post("/add", userController.checkLoggedIn, eventController.add, homeController.redirectView); // Add a new event

router.get("/:id", eventController.show, eventController.showView); // Show details of a specific event

router.get("/:id/edit", userController.checkLoggedIn, eventController.edit); // Show edit page for a specific event

router.put("/:id/update", userController.checkLoggedIn, eventController.update, homeController.redirectView); // Update a specific event to database

router.delete("/:id/delete", userController.checkLoggedIn, eventController.delete, homeController.redirectView); // Delete a specific event frrom database

router.put("/attend", userController.checkLoggedIn, eventController.attend); // Attend an event if user is logged in (adds to attendees array in database)

module.exports = router;
