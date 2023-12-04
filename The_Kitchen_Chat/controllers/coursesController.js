const Course = require("../models/course");
const httpStatus = require("http-status-codes");
const User = require("../models/user");
module.exports = {
  index: (req, res, next) => {
    Course.find()
      .then((courses) => {
        res.locals.courses = courses;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching courses: ${error.message}`);
        next(error);
      });
  },
  indexView: (req, res) => {
    res.render("courses/index");
  },
  new: (req, res) => {
    res.render("courses/new");
  },
  create: (req, res, next) => {
    let courseParams = {
      title: req.body.title,
      description: req.body.description,
      items: req.body.items.split(",").map((item) => item.trim()),
      zipCode: req.body.zipCode,
    };
    Course.create(courseParams)
      .then((course) => {
        res.locals.redirect = "/courses";
        res.locals.course = course;
        next();
      })
      .catch((error) => {
        console.log(`Error saving course: ${error.message}`);
        next(error);
      });
  },
  redirectView: (req, res, next) => {
    let redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },
  show: (req, res, next) => {
    let courseId = req.params.id;
    Course.findById(courseId)
      .then((course) => {
        res.locals.course = course;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching course by ID: ${error.message}`);
        next(error);
      });
  },
  showView: (req, res) => {
    res.render("courses/show");
  },
  edit: (req, res, next) => {
    let courseId = req.params.id;
    Course.findById(courseId)
      .then((course) => {
        res.render("courses/edit", {
          course: course,
        });
      })
      .catch((error) => {
        console.log(`Error fetching course by ID: ${error.message}`);
        next(error);
      });
  },
  update: (req, res, next) => {
    let courseId = req.params.id,
      courseParams = {
        title: req.body.title,
        description: req.body.description,
        items: req.body.items.split(",").map((item) => item.trim()),
        zipCode: req.body.zipCode,
      };
    Course.findByIdAndUpdate(courseId, {
      $set: courseParams,
    })
      .then((course) => {
        res.locals.redirect = `/courses/${courseId}`;
        res.locals.course = course;
        next();
      })
      .catch((error) => {
        console.log(`Error updating course by ID: ${error.message}`);
        next(error);
      });
  },
  delete: (req, res, next) => {
    let courseId = req.params.id;
    Course.findByIdAndRemove(courseId)
      .then(() => {
        res.locals.redirect = "/courses";
        next();
      })
      .catch((error) => {
        console.log(`Error deleting course by ID: ${error.message}`);
        next();
      });
  },
  respondJSON: (req, res) => {
    res.json({
      status: httpStatus.OK,
      data: res.locals,
    });
  },
  errorJSON: (error, req, res, next) => {
    let errorObject;
    if (error) {
      errorObject = {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: error.message,
      };
    } else {
      errorObject = {
        status: httpStatus.INTERNAL_SERVER_ERROR,
        message: "Unknown Error.",
      };
    }
    res.json(errorObject);
  },
  join: (req, res, next) => {
    let courseId = req.params.id,
      currentUser = req.user;
    if (currentUser) {
      User.findByIdAndUpdate(currentUser, {
        $addToSet: {
          courses: courseId,
        },
      })
        .then(() => {
          res.locals.success = true;
          next();
        })
        .catch((error) => {
          next(error);
        });
    } else {
      next(new Error("User must log in."));
    }
  },
  filterUserCourses: (req, res, next) => {
    // Get the current user from res.locals
    let currentUser = res.locals.currentUser;
    // Check if there is a current user
    if (currentUser) {
      // Map through the courses in res.locals
      let mappedCourses = res.locals.courses.map((course) => {
        // Check if the current user has joined the course
        let userJoined = currentUser.courses.some((userCourse) => {
          return userCourse.equals(course._id);
        });
        // Add a 'joined' property to the course object indicating whether the user has joined
        return Object.assign(course.toObject(), { joined: userJoined });
      });
      // Update res.locals.courses with the mapped courses
      res.locals.courses = mappedCourses;
      // Continue to the next middleware
      next();
    } else {
      // If there is no current user, continue to the next middleware
      next();
    }
  },
};
