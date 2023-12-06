const Event = require("../models/event");
const httpStatus = require("http-status-codes");

const getEventParams = (body) => {
  // Extract info from form and set to object fields
  return {
    title: body.title,
    description: body.description,
    location: body.location,
    startDate: new Date(body.startDate),
    endDate: new Date(body.endDate),
    isOnline: body.isOnline == 'on' ? true : false,
    registrationLink: body.registrationLink,
  };
};

module.exports = {
  index: (req, res, next) => {
    Event.find()
      .then((events) => {
        res.locals.events = events;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching events: ${error.message}`);
        next(error);
      });
  },
  respondJSON: (req, res) => {
    res.json({
      status: httpStatus.OK,
      events: res.locals.events,
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
  getEvents: async (req, res, next) => {
    // Retrieve all events from the database
    const events = await Event.find();

    // Render the events.ejs view with the retrieved events
    res.render("events/index", { events });
   
  },
  show: (req, res, next) => {
    // Get info for individual event
    let eventId = req.params.id;
    Event.findById(eventId)
      .then((event) => {
        res.locals.event = event;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching event by ID: ${error.message}`);
        next(error);
      });
  },
  showView: (req, res) => {
    // Show individual event page
    res.render("events/show");
  },
  create: (req, res) => {
    // Show page for creating an event
    res.render("events/create")
  },
  add: (req, res, next) => {
    // Get input info from create page and add to database
    let eventParams = getEventParams(req.body);
    eventParams.organizer = res.locals.currentUser._id
    eventParams.organizerName = res.locals.currentUser.name
    Event.create(eventParams)
      .then((event) => {
        req.flash(
          "success",
          `${event.title} was created successfully!`
        );
        res.locals.redirect = "/events";
        res.locals.event = event;
        next();
      })
      .catch((error) => {
        console.log(`Error saving event: ${error.message}`);
        req.flash(
          "error",
          `Failed to create event because: ${error.message}.`
        );
        res.locals.redirect = "/events/create";
        next();
      });
  },
  edit: (req, res, next) => {
    // Edit currently selected event
    let eventId = req.params.id;
    Event.findById(eventId)
      .then((event) => {
        res.render("events/edit", {
          event: event,
        });
      })
      .catch((error) => {
        console.log(`Error fetching event by ID: ${error.message}`);
        next(error);
      });
  },
  update: (req, res, next) => {
    // Send edited event info to database
    let eventId = req.params.id,
      eventParams = getEventParams(req.body);
    Event.findByIdAndUpdate(eventId, {
      $set: eventParams,
    })
      .then((events) => {
        res.locals.redirect = `/events/${eventId}`;
        res.locals.events = events;
        req.flash("success", `You have successfully updated the event!`);
        next();
      })
      .catch((error) => {
        console.log(`Error updating event by ID: ${error.message}`);
        req.flash("error", `Something went wrong updating your event! Please try again!`);
        next(error);
      });
  },
  delete: (req, res, next) => {
    // Delete event from database
    let eventId = req.params.id;
    Event.findByIdAndRemove(eventId)
      .then(() => {
        res.locals.redirect = "/events";
        req.flash("success", `You have successfully deleted the event!`);
        next();
      })
      .catch((error) => {
        console.log(`Error deleting event by ID: ${error.message}`);
        req.flash("error", `Something went wrong deleting your event! Please try again!`);
        next();
      });
  },
  attend: async (req, res, next) => {
    // If user is not logged in and is attending then use req.session.originalObjectID after logging in otherwise if logged in
    // use req.body.event_id
    let event_id = !req.session.originalObjectID ? req.body.object_id : req.session.originalObjectID
    let check_modal = false
    req.session.originalObjectID = undefined

    // For event modal, set value from parameter
    if (!event_id) {
      event_id = req.params.id
      check_modal = true
    }

    // Find the event by id
    const event = await Event.findById(event_id);
    if (!event) {
      req.flash("error", `${req.body.event_id} was not found!`);
      next();
      return
    }

    // Check if the user is already attending
    if (event.attendees.includes(res.locals.currentUser._id)) {
      req.flash("error", `You have already registered for this event!`);
      if (check_modal) {
        res.json({
          join_status: false
        });
        next();
        return
      }
      res.redirect("/events")
    } else {
        // Update the attendees field
        event.attendees.push(res.locals.currentUser._id);

        //Update Applicant Names
        event.attendeesNames.push(res.locals.currentUser.name)
        
        // Save the updated event
        await event.save();

        // Respond with success message or other relevant information
        req.flash("success", `${res.locals.currentUser.name} has successfully registered for the event!`);
        
        if (check_modal) {
          res.json({
            join_status: true
          });
          next();
          return
        }
        res.redirect("/events")
    }
  },
  validate: (req, res, next) => {
    // Validation middleware for /events/add
    req.check("title", "Event Title is required").notEmpty();
    req.check("description", "Event Description is required").notEmpty();
    req.check("location", "Event Location is required").notEmpty();
    req.check("startDate", "Start Date is required").notEmpty();
    req.check("endDate", "End Date is required").notEmpty();
    req.check("registrationLink", "Registration Link is required").optional().isURL();
    
    req.getValidationResult().then((error) => {
      if (!error.isEmpty()) {
        let messages = error.array().map((e) => e.msg);
        req.skip = true;
        req.flash("error", messages.join(" and "));
        res.locals.redirect = "/events/add";
        next();
      } else {
        next();
      }
    });
  }
};
