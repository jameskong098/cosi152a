const mongoose = require("mongoose");
const subcriberSchema = mongoose.Schema({
  name: String,
  email: String,
  zipCode: Number,
});

module.exports = mongoose.model("Subscriber", subcriberSchema);
