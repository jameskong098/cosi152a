const User = require("../models/user");

const getUserParams = (body) => {
  // Extract info from form and set to object fields
  return {
    name: body.name,
    email: body.email,
    password: body.password,
    graduationYear: body.graduationYear,
    major: body.major,
    role: body.role || 'student',
    job: body.job,
    company: body.company,
    city: body.city,
    state: body.state,
    country: body.country,
    zipCode: body.zipCode,
    bio: body.bio,
    interests: body.interests ? body.interests.split(',').map((interest) => interest.trim()) : []
  };
};

module.exports = {
  index: (req, res, next) => {
    // Obtain info for user from database
    User.find()
      .then((users) => {
        res.locals.users = users;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching users: ${error.message}`);
        next(error);
      });
  },
  indexView: (req, res) => {
    // Show view for all users
    res.render("users/index");
  },
  signup: (req, res) => {
    // Show signup page
    res.render("users/signup");
  },
  create: (req, res, next) => {
    // Get input info from signup page and add to database
    let userParams = getUserParams(req.body);
    User.create(userParams)
      .then((user) => {
        req.flash(
          "success",
          `${user.name}'s account created successfully!`
        );
        res.locals.redirect = "/users";
        res.locals.user = user;
        next();
      })
      .catch((error) => {
        console.log(`Error saving user: ${error.message}`);
        req.flash(
          "error",
          `Failed to create user account because: ${error.message}.`
        );
        res.locals.redirect = "/users/new";
        next();
      });
  },
  show: (req, res, next) => {
    // Get info for individual user
    let userId = req.params.id;
    User.findById(userId)
      .then((user) => {
        res.locals.user = user;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching user by ID: ${error.message}`);
        next(error);
      });
  },
  showView: (req, res) => {
    // Show all users
    res.render("users/show");
  },
  edit: (req, res, next) => {
    // Edit currently selected user
    let userId = req.params.id;
    User.findById(userId)
      .then((user) => {
        res.render("users/edit", {
          user: user,
        });
      })
      .catch((error) => {
        console.log(`Error fetching user by ID: ${error.message}`);
        next(error);
      });
  },
  update: (req, res, next) => {
    // Send edited user info to database
    let userId = req.params.id,
      userParams = getUserParams(req.body);
    User.findByIdAndUpdate(userId, {
      $set: userParams,
    })
      .then((user) => {
        res.locals.redirect = `/users/${userId}`;
        res.locals.user = user;
        req.flash("success", `You have successfully updated your user information!`);
        next();
      })
      .catch((error) => {
        console.log(`Error updating user by ID: ${error.message}`);
        req.flash("error", `Something went wrong updating your user information! Please try again!`);
        next(error);
      });
  },
  delete: (req, res, next) => {
    // Delete user from database
    let userId = req.params.id;
    User.findByIdAndRemove(userId)
      .then(() => {
        res.locals.redirect = "/users";
        req.flash("success", `You have successfully deleted the user!`);
        next();
      })
      .catch((error) => {
        console.log(`Error deleting user by ID: ${error.message}`);
        req.flash("error", `Something went wrong deleting the user! Please try again!`);
        next();
      });
  },
  login: (req, res) => {
    // Show view for login page
    res.render("users/login");
  },
  logout: (req, res) => {
    // Log out user account
    req.session.destroy(err => {
      if (err) {
        console.error('Error destroying session:', err);
      } else {
          res.redirect('/');
      }
    });
  },
  authenticate: (req, res, next) => {
    // Authenticate user credentials and redirect to appropriate pages
    User.findOne({
      email: req.body.email,
    })
      .then((user) => {
        if (user && user.password === req.body.password) {
          res.locals.redirect = !req.session.prevURL ? `/users/${user._id}` : req.session.prevURL;
          req.session.user = user;
          res.locals.user = user;
          req.flash("success", `Welcome ${user.name}! You have logged in successfully!`);
          next();
        } else {
            req.flash(
              "error",
              "Your account or password is incorrect. Please try again or contact your system administrator!"
            );
            res.locals.redirect = "/login";
            next();
        }
      })
      .catch((error) => {
        console.log(`Error logging in user: ${error.message}`);
        next(error);
      });
  },
  checkLoggedIn: (req, res, next) => {
    // Verify if the user is logged in or not 
    if (!req.session || !req.session.user) {
      req.session.prevURL = req.originalUrl
      req.session.originalObjectID = req.body.object_id
      res.redirect("/login")
    } else {
      next();
    }
  },
};
