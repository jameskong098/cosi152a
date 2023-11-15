const Job = require("../models/job");

const getJobParams = (body) => {
  return {
    title: body.title,
    company: body.company,
    location: body.location,
    description: body.description,
    requirements: body.requirements,
    salary: body.salary,
    contactEmail: body.contactEmail,
    contactPhone: body.contactPhone,
    postDate: new Date(body.postDate),
    deadlineDate: new Date(body.deadlineDate),
    isActive: body.isActive == 'on' ? true : false,
  };
};

module.exports = {
  getJobs: async (req, res, next) => {
    try {
      // Retrieve all jobs from the database
      const jobs = await Job.find();

      // Render the jobs.ejs view with the retrieved jobs
      res.render("jobs/index", { jobs });
    } catch (error) {
      console.log(`Error fetching jobs: ${error.message}`);
      next(error);
    }
  },
  show: (req, res, next) => {
    let jobId = req.params.id;
    Job.findById(jobId)
      .then((job) => {
        res.locals.job = job;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching job by ID: ${error.message}`);
        next(error);
      });
  },
  showView: (req, res) => {
    res.render("jobs/show");
  },
  create: (req, res) => {
    res.render("jobs/create");
  },
  add: (req, res, next) => {
    let jobParams = getJobParams(req.body);
    jobParams.organizer = req.session.user._id;

    Job.create(jobParams)
      .then((job) => {
        req.flash("success", `${job.title} was created successfully!`);
        res.locals.redirect = "/jobs";
        res.locals.job = job;
        next();
      })
      .catch((error) => {
        console.log(`Error saving job: ${error.message}`);
        req.flash("error", `Failed to create job because: ${error.message}.`);
        res.locals.redirect = "/jobs/create";
        next();
      });
  },
  edit: (req, res, next) => {
    let jobId = req.params.id;
    Job.findById(jobId)
      .then((job) => {
        res.render("jobs/edit", {
          job: job,
        });
      })
      .catch((error) => {
        console.log(`Error fetching job by ID: ${error.message}`);
        next(error);
      });
  },
  update: (req, res, next) => {
    let jobId = req.params.id,
      jobParams = getJobParams(req.body);

    Job.findByIdAndUpdate(jobId, {
      $set: jobParams,
    })
      .then((job) => {
        res.locals.redirect = `/jobs/${jobId}`;
        res.locals.job = job;
        next();
      })
      .catch((error) => {
        console.log(`Error updating job by ID: ${error.message}`);
        next(error);
      });
  },
  delete: (req, res, next) => {
    let jobId = req.params.id;
    Job.findByIdAndRemove(jobId)
      .then(() => {
        res.locals.redirect = "/jobs";
        next();
      })
      .catch((error) => {
        console.log(`Error deleting job by ID: ${error.message}`);
        next(error);
      });
  },
  apply: async (req, res, next) => {
    // Find the job by ID
    const job = await Job.findById(req.body.job_id);

    if (!job) {
      req.flash("error", `${req.body.job_id} was not found!`);
      next();
      return;
    }

    // Check if the user has already applied
    if (job.applicants.includes(req.session.user._id)) {
      req.flash("error", `You have already applied for this job!`);
      res.redirect("/jobs");
      return;
    }

    // Update the applicants field
    job.applicants.push(req.session.user._id);

    // Save the updated job
    await job.save();

    // Respond with success message or other relevant information
    req.flash("success", `${req.session.user.name} has successfully applied for the job!`);
    res.redirect("/jobs");
  },
};
