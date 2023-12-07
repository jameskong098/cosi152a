const User = require("../models/user");
const passport = require("passport");

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
    if (req.skip) next();
    let newUser = new User(getUserParams(req.body));
    User.register(newUser, req.body.password, (error, user) => {
      if (user) {
        req.flash(
          "success",
          `${user.name}'s account created successfully!`
        );
        res.locals.redirect = "/users";
        next();
      } else {
        req.flash(
          "error",
          `Failed to create user account because:${error.message}.`
        );
        res.locals.redirect = "/users/new";
        next();
      }
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
        console.log(`POOP Error fetching user by ID: ${error.message}`);
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
  authenticate: (req, res, next) => {
    passport.authenticate("local", {
      failureRedirect: "/users/login",
      failureFlash: "Your account or password is incorrect. Please try again or contact your system administrator.",
    })(req, res, () => {
      // Flash a success message after successful authentication
      req.flash("success", "Welcome! You are logged in!");
      res.redirect("/");
    });
  },
  logout: (req, res, next) => {
    req.logout(function (err) {
      if (err) {
        return next(err);
      }
      req.flash("success", "You have been logged out!");
      res.locals.redirect = "/";
      next();
    });
  },
  validate: (req, res, next) => {
    req
      .sanitizeBody("email")
      .normalizeEmail({
        all_lowercase: true,
      })
      .trim();
    req.check("email", "Email is invalid").isEmail();
    req
      .check("zipCode", "Zip code is invalid")
      .notEmpty()
      .isInt()
      .isLength({
        min: 5,
        max: 5,
      })
      .equals(req.body.zipCode);
    req.check("password", "Password cannot be empty").notEmpty();
    req.getValidationResult().then((error) => {
      if (!error.isEmpty()) {
        let messages = error.array().map((e) => e.msg);
        req.skip = true;
        req.flash("error", messages.join(" and "));
        res.locals.redirect = "/users/new";
        next();
      } else {
        next();
      }
    });
  },
  checkLoggedIn: (req, res, next) => {
    // Verify if the user is logged in or not 
    if (!res.locals.loggedIn) {
      req.session.prevURL = req.originalUrl
      req.session.originalObjectID = req.body.object_id
      res.redirect("/users/login")
    } else {
      next();
    }
  },
  verifyToken: (req, res, next) => {
    let token = req.query.apiToken;

    if (token) {
      User.findOne({ apiToken: token })
        .then((user) => {
          if (user) next();
          else next(new Error("Invalid API token"));
        })
        .catch((error) => {
          next(new Error(error.message));
        });
    } else next(new Error("Invalid API token"));
  },
};
