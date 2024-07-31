const mongoose = require("mongoose");
// const { nomenclatureSchema } = require("./Nomenclature");
const Schema = mongoose.Schema;

const detailSchema = new Schema({
  title: {
    type: String,
    required: true,
    maxlength: 50,
  },
  description: {
    type: String,
    required: false,
    default: null,
    maxlength: 200,
  },
  img: {
    type: String,
    required: false,
    default: null,
  },
  // subnodes: [{ type: Schema.Types.ObjectId, ref: "SubNode" }],
  // nomenclature: { type: nomenclatureSchema },
});

const Detail = mongoose.model("Detail", detailSchema);

module.exports = Detail;
