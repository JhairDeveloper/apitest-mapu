const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const careerSchema = new Schema({
  name: {
    type: String,
    required: true,
    maxlength: 100,
    unique: true,
  },
  description: {
    type: String,
    required: false,
    maxlength: 200,
  },
  manager: {
    type: String,
    required: true,
    maxlength: 125,
  },
  faculty: {
    type: Schema.Types.ObjectId,
    ref: "Faculty",
    required: true,
  },
});

const Career = mongoose.model("Career", careerSchema);

module.exports = Career;
