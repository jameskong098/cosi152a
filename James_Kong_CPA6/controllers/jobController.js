const Job = require("../models/job");

const getJobParams = (body) => {
  // Extract info from form and set to object fields
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
    // Get info for individual job
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
    // Show individual job page
    res.render("jobs/show");
  },
  create: (req, res) => {
    // Show page for creating a job
    res.render("jobs/create");
  },
  add: (req, res, next) => {
    // Get input info from create page and add to database
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
    // Edit currently selected job
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
    // Send edited job info to database
    let jobId = req.params.id,
      jobParams = getJobParams(req.body);

    Job.findByIdAndUpdate(jobId, {
      $set: jobParams,
    })
      .then((job) => {
        res.locals.redirect = `/jobs/${jobId}`;
        res.locals.job = job;
        req.flash("success", `You have successfully updated the job!`);
        next();
      })
      .catch((error) => {
        console.log(`Error updating job by ID: ${error.message}`);
        req.flash("error", `Something went wrong updating the job! Please try again!`);
        next(error);
      });
  },
  delete: (req, res, next) => {
    // Delete job from database
    let jobId = req.params.id;
    Job.findByIdAndRemove(jobId)
      .then(() => {
        res.locals.redirect = "/jobs";
        req.flash("success", `You have successfully deleted the job!`);
        next();
      })
      .catch((error) => {
        console.log(`Error deleting job by ID: ${error.message}`);
        req.flash("error", `Something went wrong deleting the job! Please try again!`);
        next(error);
      });
  },
  apply: async (req, res, next) => {
    // If user is not logged in and is applying then use req.session.originalObjectID after logging in otherwise if logged in
    // use req.body.job_id
    const job_id = !req.session.originalObjectID ? req.body.object_id : req.session.originalObjectID
    req.session.originalObjectID = undefined

    // Find the job by id
    const job = await Job.findById(job_id);

    if (!job) {
      req.flash("error", `${req.body.job_id} was not found!`);
      next();
      return;
    }

    // Check if the user has already applied
    if (job.applicants.includes(req.session.user._id)) {
      req.flash("error", `You have already applied for this job!`);
      res.redirect("/jobs");
    } else {
        // Update the applicants field
        job.applicants.push(req.session.user._id);

        // Save the updated job
        await job.save();

        // Respond with success message or other relevant information
        req.flash("success", `${req.session.user.name} has successfully applied for the job!`);
        res.redirect("/jobs");
    }
  },
};
