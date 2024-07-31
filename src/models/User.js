const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 25,
  },
  lastname: {
    type: String,
    required: true,
    min: 3,
    max: 25,
  },
  email: {
    type: String,
    min: 5,
    max: 30,
    default: null,
  },
  bloqued: {
    type: Boolean,
    default: false,
  },
  avatar: {
    type: String,
    required: false,
    default: null,
  },
  password: {
    type: String,
    required: true,
    min: 5,
    max: 30,
  },
  settings: {
    notification: {
      type: Boolean,
      required: false,
      default: true,
    },
    spam: {
      type: Boolean,
      required: false,
      default: true,
    },
  },
  role: {
    type: Schema.Types.ObjectId,
    ref: "Role",
    required: true,
  },
  token: {
    type: String,
    required: false,
  },
  tokenExpiresAt: {
    type: Date,
    required: false,
  },
});

// Override the 'toJSON' function to customize the JSON output
userSchema.set("toJSON", {
  transform: function (doc, ret) {
    delete ret.password;
    delete ret.__v;
    delete ret.token;
    delete ret.tokenExpiresAt;

    if (!ret.avatar)
      ret.avatar =
        "https://i.pinimg.com/474x/5d/69/42/5d6942c6dff12bd3f960eb30c5fdd0f9.jpg";
  },
});

const User = mongoose.model("users", userSchema);

module.exports = User;
