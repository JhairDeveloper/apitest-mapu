const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blockSchema = new Schema({
  number: {
    type: Number,
    required: true,
    // unique: true,
    min: 1,
  },
  available: {
    type: Boolean,
    required: true,
    default: true,
  },
  faculty: {
    type: Schema.Types.ObjectId, // Tipo ObjectId para referencia
    ref: "Faculty", // Nombre del modelo referenciado
    required: true,
  },
  campus: {
    type: Schema.Types.ObjectId,
    ref: "Campus",
    required: true,
  },
  node: {
    type: Schema.Types.ObjectId,
    ref: "Node",
    required: true,
    unique: true,
  },
});

const Block = mongoose.model("Block", blockSchema);

module.exports = Block;
