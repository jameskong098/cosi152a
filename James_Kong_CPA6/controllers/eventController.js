const Event = require("../models/event");

module.exports = {
  getEvents: async (req, res, next) => {
    // Retrieve all events from the database
    const events = await Event.find();

    // Render the events.ejs view with the retrieved events
    res.render("events", { events });
   
  },
  attend: async (req, res, next) => {
    // Find the event by registrationLink
    const event = await Event.findOne({ registrationLink: req.body.event_registrationLink });

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
  }
};
