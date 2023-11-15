const mongoose = require("mongoose");

// Define the schema for the User model
const userSchema = mongoose.Schema({
    name: { type: String, required: true }, // User's name (required)
    email: { type: String, required: true, unique: true }, // User's email (required and unique)
    password: { type: String, required: true }, // User's password (required)
    role: { type: String, enum: ["student", "alumni"], default: "student" }, // User's role, defaults to "student"
    graduationYear: { type: Number, required: true }, // Year of graduation (required)
    major: { type: String, required: true }, // User's major (required)
    job: { type: String }, // User's current job (optional)
    company: { type: String }, // Company where the user works (optional)
    city: { type: String }, // City where the user is located (optional)
    state: { type: String }, // State where the user is located (optional)
    country: { type: String }, // Country where the user is located (optional)
    zipCode: { type: Number, min: 10000, max: 99999 }, // User's ZIP code (optional, with constraints)
    bio: { type: String }, // User's biography (optional)
    interests: [{ type: String }] // Array of user's interests (optional)
});

// Define a method to get basic information about the user
userSchema.methods.getInfo = function () {
    return `Name: ${this.name} Email: ${this.email} Zip Code: ${this.zipCode}`;
};

// Define a method to find users with the same ZIP code
userSchema.methods.findLocalUsers = function () {
    return this.model("User").find({ zipCode: this.zipCode });
};

module.exports = mongoose.model("User", userSchema);
