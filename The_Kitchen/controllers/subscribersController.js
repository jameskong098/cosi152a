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

exports.getSubscriptionPage = (req, res) => {
  res.render("subscribe");
};
exports.saveSubscriber = (req, res) => {
  let newSubscriber = new Subscriber({
    name: req.body.name,
    email: req.body.email,
    zipCode: req.body.zipCode,
  });
  newSubscriber
    .save()
    .then((subscriber) => {
      res.render("thanks");
    })
    .catch((error) => {
      if (error) {
        res.send(error);
      }
    });
  console.log(newSubscriber.getInfo());
  newSubscriber.findLocalSubscribers().then((local) => {
    console.log(local);
  });
};
