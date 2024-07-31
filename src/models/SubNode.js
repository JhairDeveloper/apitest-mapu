const mongoose = require("mongoose");
const { nomenclatureSchema } = require("./Nomenclature");
const Schema = mongoose.Schema;

const subNodeSchema = new Schema({
  latitude: {
    type: String,
    required: true,
    minLength: 1,
  },
  longitude: {
    type: String,
    required: true,
    minLength: 1,
  },
  name: {
    type: String,
    required: true,
    minLength: 1,
  },
  description: {
    type: String,
    required: false,
    minLength: 1,
  },
  detail: {
    type: Schema.Types.ObjectId,
    ref: "Detail",
    required: true,
  },
  img: {
    type: String,
    required: false,
    default: null,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
  },
  nomenclature: {
    type: new Schema({
      floor: {
        type: Number,
        required: false,
        default: 1,
      },
      environment: {
        type: Number,
        required: false,
        default: null,
      },
      subEnvironment: {
        type: Number,
        required: false,
        default: null,
      },
    }),
  },
});

const SubNode = mongoose.model("subnode", subNodeSchema);

module.exports = SubNode;
