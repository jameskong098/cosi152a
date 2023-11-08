const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true}, 
    password: { type: String, required: true },
    role: { type: String, enum: ["student", "alumni"], default: "student" },
    graduationYear: { type: Number, required: true },
    major: { type: String, required: true},
    job: { type: String },
    company: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    zipCode: { type: Number, min: 10000, max: 99999 },
    bio: { type: String },
    interests: [{ type: String }]  
});

userSchema.methods.getInfo = function () {
    return `Name: ${this.name} Email: ${this.email} Zip Code: ${this.zipCode}`;
};
userSchema.methods.findLocalUsers = function () {
    return this.model("User").find({ zipCode: this.zipCode });
};

module.exports = mongoose.model("User", userSchema);
