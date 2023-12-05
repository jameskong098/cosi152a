const mongoose = require("mongoose");

// Define the schema for the Event model
const eventSchema = mongoose.Schema({
    title: { type: String, required: true }, // Title of the event (required)
    description: { type: String, required: true }, // Description of the event (required)
    location: { type: String, required: true }, // Location of the event (required)
    startDate: { type: Date, required: true }, // Start date of the event (required)
    endDate: { type: Date, required: true }, // End date of the event (required)
    isOnline: { type: Boolean, default: false }, // Indicates if the event is online, default is false
    registrationLink: { type: String }, // Link for event registration (optional)
    organizer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User model for the event organizer (required)
    organizerName : { type: String, required: true }, // Keep track of organizer's name
    attendees: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Array of User references for attendees
});

// Define a method to get information about the event
eventSchema.methods.getInfo = function () {
    return `Title: ${this.title} Description: ${this.description} Location: ${this.location}`;
};

module.exports = mongoose.model("Event", eventSchema);
