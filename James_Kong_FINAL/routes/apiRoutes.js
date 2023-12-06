const router = require("express").Router();
const eventController = require("../controllers/eventController");
const userController = require("../controllers/userController");

router.use(userController.verifyToken);

router.get(
  "/events",
  eventController.index,
  eventController.respondJSON
);

router.use(eventController.errorJSON);

module.exports = router;
