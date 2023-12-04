const mongoose = require("mongoose");
const Subscriber = require("../models/subscriber");
const Course = require("../models/course");
const subscriber = require("../models/subscriber");

module.exports = {
  getAllSubscribers: (req, res, next) => {
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
  },

  getSubscriptionPage: (req, res) => {
    res.render("subscribe");
  },
  saveSubscriber: (req, res) => {
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
  },
  index: (req, res, next) => {
    Subscriber.find()
      .then((subscribers) => {
        res.locals.subscribers = subscribers;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching subscribers: ${error.message}`);
        next(error);
      });
  },
  indexView: (req, res) => {
    res.render("subscribers/index");
  },
  new: (req, res) => {
    let courseId = req.params.id;
    res.render("subscribers/new", { courseId: courseId });
  },
  create: (req, res, next) => {
    Subscriber.find({ email: req.body.email }).then((subscriber) => {
      if (subscriber.length !== 0) {
        Course.find({ _id: req.body.courseId }).then((course) => {
          Subscriber.updateOne(
            { email: req.body.email },
            {
              $push: { courses: course },
            }
          )
            .then((subscriber) => {
              console.log(subscriber);
              res.locals.redirect = "/subscribers";
              res.locals.subscriber = subscriber;
              next();
            })
            .catch((error) => {
              console.log(`Error updating subscriber: ${error.message}`);
              next(error);
            });
        });
      } else {
        Subscriber.create({
          name: req.body.name,
          email: req.body.email,
          zipCode: req.body.zipCode,
          courses: req.body.courseId,
        })
          .then((subscriber) => {
            res.locals.redirect = "/subscribers";
            res.locals.subscriber = subscriber;
            next();
          })
          .catch((error) => {
            console.log(`Error saving subscriber: ${error.message}`);
            next(error);
          });
      }
    });
  },
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },
  show: (req, res, next) => {
    let subscriberId = req.params.id;
    Subscriber.findById(subscriberId)
      .then((subscriber) => {
        Subscriber.populate(subscriber, "courses").then((subscriber) => {
          console.log(subscriber);
          res.locals.subscriber = subscriber;
          next();
        });
      })
      .catch((error) => {
        console.log(`Error fetching subscriber by ID: ${error.message}`);
        next(error);
      });
  },
  showView: (req, res) => {
    res.render("subscribers/show");
  },
  edit: (req, res, next) => {
    let subscriberId = req.params.id;
    Subscriber.findById(subscriberId)
      .then((subscriber) => {
        res.render("subscribers/edit", {
          subscriber: subscriber,
        });
      })
      .catch((error) => {
        console.log(`Error fetching subscriber by ID: ${error.message}`);
        next(error);
      });
  },
  update: (req, res, next) => {
    let subscriberId = req.params.id,
      subscriberParams = {
        name: req.body.name,
        email: req.body.email,
        zipCode: req.body.zipCode,
      };
    Subscriber.findByIdAndUpdate(subscriberId, {
      $set: subscriberParams,
    })
      .then((subscriber) => {
        res.locals.redirect = `/subscribers/${subscriberId}`;
        res.locals.subscriber = subscriber;
        next();
      })
      .catch((error) => {
        console.log(`Error updating subscriber by ID: ${error.message}`);
        next(error);
      });
  },
  delete: (req, res, next) => {
    let subscriberId = req.params.id;
    Subscriber.findByIdAndRemove(subscriberId)
      .then(() => {
        res.locals.redirect = "/subscribers";
        next();
      })
      .catch((error) => {
        console.log(`Error deleting subscriber by ID: ${error.message}`);
        next();
      });
  },
};
