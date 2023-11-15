const mongoose = require("mongoose");

const jobSchema = mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String, required: true },
    requirements: { type: String, required: true },
    salary: { type: Number, required: true },
    contactEmail: { type: String, required: true },
    contactPhone: { type: String, required: true },
    postDate: { type: Date, default: Date.now },
    deadlineDate: { type: Date, required: true },
    isActive: { type: Boolean, default: true },
    applicants: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

jobSchema.methods.getInfo = function () {
    return `Title: ${this.title} Company: ${this.company} Location: ${this.location}`;
};

module.exports = mongoose.model("Job", jobSchema);
