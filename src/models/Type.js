const mongoose = require("mongoose");
const {
  ROUTE_NODO_TYPE,
  INTEREST_NODO_TYPE,
  ACCESS_NODO_TYPE,
  BLOCK_NODO_TYPE,
} = require("../constants");
const Schema = mongoose.Schema;

const typeSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    // minLength: 2,
    maxLength: 30,
    isIn: [
      ROUTE_NODO_TYPE,
      INTEREST_NODO_TYPE,
      ACCESS_NODO_TYPE,
      BLOCK_NODO_TYPE,
    ],
  },
  desc: {
    type: String,
    required: true,
    // minLength: 2,
    maxLength: 30,
  },
});

const Type = mongoose.model("Type", typeSchema);

module.exports = Type;
