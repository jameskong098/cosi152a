const mongoose = require("mongoose");
const Event = require("../models/event");

module.exports = {
  getEvents: (req, res, next) => {
    res.render("events");
  }
};
