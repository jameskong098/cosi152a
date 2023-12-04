const mongoose = require("mongoose");
const Subscriber = require("./subscriber");
const passportLocalMongoose = require("passport-local-mongoose");
const randToken = require("rand-token");

const Schema = mongoose.Schema;
const userSchema = Schema(
  {
    name: {
      first: {
        type: String,
        trim: true,
      },
      last: {
        type: String,
        trim: true,
      },
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      unique: true,
    },
    zipCode: {
      type: Number,
      min: [1000, "Zip code too short"],
      max: 99999,
    },
    courses: [{ type: Schema.Types.ObjectId, ref: "Course" }],
    subscribedAccount: { type: Schema.Types.ObjectId, ref: "Subscriber" },
    apiToken: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.virtual("fullName").get(function () {
  return `${this.name.first} ${this.name.last}`;
});

userSchema.pre("save", function (next) {
  let user = this;
  if (user.subscribedAccount === undefined) {
    Subscriber.findOne({
      email: user.email,
    })
      .then((subscriber) => {
        user.subscribedAccount = subscriber;
        next();
      })
      .catch((error) => {
        console.log(`Error in connecting subscriber: ${error.message}`);
        next(error);
      });
  } else {
    next();
  }
});

userSchema.pre("save", function (next) {
  let user = this;
  if (!user.apiToken) {
    user.apiToken = randToken.generate(16);
    next();
  } else {
    next();
  }
});

userSchema.plugin(passportLocalMongoose, { usernameField: "email" });

module.exports = mongoose.model("User", userSchema);
