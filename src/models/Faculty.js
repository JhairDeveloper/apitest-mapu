const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const facultySchema = new Schema({
  name: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 150,
    unique: true,
  },
  description: {
    type: String,
    required: false,
    default: null,
    maxLength: 200,
  },
  dean: {
    type: String,
    required: false,
    default: null,
    maxLength: 150,
  },
  polygons: {
    type: Array,
    required: true,
  },
});

const Faculty = mongoose.model("Faculty", facultySchema);

module.exports = Faculty;
