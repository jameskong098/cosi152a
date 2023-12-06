const router = require("express").Router();
const userController = require("../controllers/userController");
const jobController = require("../controllers/jobController");
const homeController = require("../controllers/homeController");

router.get("/", jobController.getJobs, homeController.redirectView); // Render jobs page

router.get("/create", userController.checkLoggedIn, jobController.validate, jobController.create); // Show create job page if user is logged in

router.post("/add", userController.checkLoggedIn, jobController.add, homeController.redirectView); // Add a new job

router.get("/:id", jobController.show, jobController.showView); // Show details of a specific job

router.get("/:id/edit", userController.checkLoggedIn, jobController.edit); // Show edit page for a specific job

router.put("/:id/update", userController.checkLoggedIn, jobController.update, homeController.redirectView); // Update a specific job to database

router.delete("/:id/delete", userController.checkLoggedIn, jobController.delete, homeController.redirectView); // Delete a specific job from database

router.put("/apply", userController.checkLoggedIn, jobController.apply); // Apply for a job if user is logged in (adds to applicants array in database)

module.exports = router;