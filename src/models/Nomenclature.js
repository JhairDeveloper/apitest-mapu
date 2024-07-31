const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const nomenclatureSchema = new Schema({
  campus: {
    type: Schema.Types.ObjectId, // Tipo ObjectId para referencia
    ref: "campus", // Nombre del modelo referenciado
    required: true,
  },
  block: {
    type: Schema.Types.ObjectId, // Tipo ObjectId para referencia
    ref: "block", // Nombre del modelo referenciado
    required: true,
  },
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
});

const Nomenclature = mongoose.model("Nomenclature", nomenclatureSchema);

module.exports = { nomenclatureSchema, Nomenclature };
