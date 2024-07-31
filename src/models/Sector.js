const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sectorSchema = new Schema({
  number: {
    type: Number,
    required: true,
    min: 1,
    // max: 30,
    unique: true,
  },
  polygon: {
    // Array de arrays de pares [latitud, longitud]
    type: [[Number, Number]],
    required: true,
  },
});

module.exports = mongoose.model("Sector", sectorSchema);
