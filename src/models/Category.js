const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 40,
  },
  description: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 200,
  },
  icon: {
    type: String,
    required: true,
  },
});

const Category = mongoose.model("Category", categorySchema);
module.exports = Category;
