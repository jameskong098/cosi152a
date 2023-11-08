const mongoose = require("mongoose");
const subcriberSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  zipCode: {
    type: Number,
    min: [10000, "Zip code is too short"],
    max: [99999, "Zip code is too long"],
  },
  courses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
});

subcriberSchema.methods.getInfo = function () {
  return `Name: ${this.name} Email: ${this.email} Zip Code: ${this.zipCode}`;
};
subcriberSchema.methods.findLocalSubscribers = function () {
  return this.model("Subscriber").find({ zipCode: this.zipCode });
};

module.exports = mongoose.model("Subscriber", subcriberSchema);
