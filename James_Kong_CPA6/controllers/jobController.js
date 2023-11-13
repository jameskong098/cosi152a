const Job = require("../models/job");

module.exports = {
  getJobs: async (req, res, next) => {
    // Retrieve all jobs from the database
    const jobs = await Job.find();

    // Render the events.ejs view with the retrieved events
    res.render("jobs", { jobs });
  },
};
