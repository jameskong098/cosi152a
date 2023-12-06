const router = require("express").Router();
const eventController = require("../controllers/eventController");
const userController = require("../controllers/userController");
const event = require("../models/event");

router.use(userController.verifyToken);

router.get(
  "/events",
  eventController.index,
  eventController.respondJSON
);

router.get(
  "/events/:id/join",
  eventController.attend
);

router.use(eventController.errorJSON);

module.exports = router;
