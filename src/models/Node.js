const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// const typeSchema = new Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   _id: {
//     type: String,
//     ref: "type",
//     required: true,
//   },
// });

// const campusSchema = new Schema({
//   name: {
//     type: String,
//     required: true,
//   },
//   _id: {
//     type: String,
//     ref: "type",
//     required: true,
//   },
// });

const nodeSchema = new Schema({
  latitude: {
    type: Number,
    required: true,
    min: -200,
    max: 200,
  },
  longitude: {
    type: Number,
    required: true,
    min: -200,
    max: 200,
  },
  available: {
    type: Boolean,
    required: false,
    default: true,
  },
  type: {
    type: Schema.Types.ObjectId,
    ref: "Type",
    required: true,
  },
  campus: {
    type: Schema.Types.ObjectId,
    ref: "Campus",
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: "Category",
    // required: true,
  },
  // block: {
  //   type: Schema.Types.ObjectId,
  //   ref: "Block",
  //   default: null,
  // },
  detail: {
    type: Schema.Types.ObjectId,
    ref: "Detail",
    default: null,
  },
});

nodeSchema.set("toJSON", {
  transform: function (doc, ret) {
    ret.coordinate = [ret.latitude, ret.longitude];
  },
});

const Node = mongoose.model("Node", nodeSchema);

module.exports = Node;
