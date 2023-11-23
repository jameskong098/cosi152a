const mongoose = require("mongoose");

// Define the schema for the Job model
const jobSchema = mongoose.Schema({
    title: { type: String, required: true }, // Title of the job (required)
    company: { type: String, required: true }, // Company offering the job (required)
    location: { type: String, required: true }, // Location of the job (required)
    description: { type: String, required: true }, // Description of the job (required)
    requirements: { type: String, required: true }, // Requirements for the job (required)
    salary: { type: Number, required: true }, // Salary for the job (required)
    contactEmail: { type: String, required: true }, // Contact email for the job (required)
    contactPhone: { type: String, required: true }, // Contact phone number for the job (required)
    postDate: { type: Date, default: Date.now }, // Date when the job was posted, default is the current date
    deadlineDate: { type: Date, required: true }, // Deadline date for job applications (required)
    isActive: { type: Boolean, default: true }, // Indicates if the job is currently active, default is true
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Array of User references for job applicants
});

// Define a method to get information about the job
jobSchema.methods.getInfo = function () {
    return `Title: ${this.title} Company: ${this.company} Location: ${this.location}`;
};

module.exports = mongoose.model("Job", jobSchema);
