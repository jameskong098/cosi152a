const mongoose = require("mongoose");
const Job = require("../models/job");

module.exports = {
  getJobs: (req, res, next) => {
    res.render("jobs");
  }
};
