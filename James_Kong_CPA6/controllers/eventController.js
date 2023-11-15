const Event = require("../models/event");

const getEventParams = (body) => {
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
  getEvents: async (req, res, next) => {
    // Retrieve all events from the database
    const events = await Event.find();

    // Render the events.ejs view with the retrieved events
    res.render("events/index", { events });
   
  },
  show: (req, res, next) => {
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
    res.render("events/show");
  },
  create: (req, res) => {
    res.render("events/create")
  },
  add: (req, res, next) => {
    let eventParams = getEventParams(req.body);
    eventParams.organizer = req.session.user._id
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
    let eventId = req.params.id,
      eventParams = getEventParams(req.body);
    Event.findByIdAndUpdate(eventId, {
      $set: eventParams,
    })
      .then((events) => {
        res.locals.redirect = `/events/${eventId}`;
        res.locals.events = events;
        next();
      })
      .catch((error) => {
        console.log(`Error updating event by ID: ${error.message}`);
        next(error);
      });
  },
  delete: (req, res, next) => {
    let eventId = req.params.id;
    Event.findByIdAndRemove(eventId)
      .then(() => {
        res.locals.redirect = "/events";
        next();
      })
      .catch((error) => {
        console.log(`Error deleting event by ID: ${error.message}`);
        next();
      });
  },
  attend: async (req, res, next) => {
    // Find the event by registrationLink
    const event = await Event.findOne({ id: req.body.event_id });

    if (!event) {
      req.flash("error", `${req.body.event_registrationLink} was not found!`);
      next();
      return
    }

    // Check if the user is already attending
    if (event.attendees.includes(req.session.user._id)) {
      req.flash("error", `You have already registered for this event!`);
      res.redirect("/events")
      return
    }

    // Update the attendees field
    event.attendees.push(req.session.user._id);
    
    // Save the updated event
    await event.save();

    // Respond with success message or other relevant information
    req.flash("success", `${req.session.user.name}'s has successfully registered for the event!`);
    res.redirect("/events")
  },
};
