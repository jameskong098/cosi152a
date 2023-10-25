const mongoose = require("mongoose");
const Subscriber = require("../models/subscriber");

exports.getAllSubscribers = (req, res, next) => {
  Subscriber.find()
    .then((subscribers) => {
      req.data = subscribers;
      next();
    })
    .catch((error) => {
      if (error) {
        next(error);
      }
    });
};
