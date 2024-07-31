const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const adjacencySchema = new Schema({
  origin: {
    type: String,
    required: true,
    ref: "Node",
  },
  destination: {
    type: String,
    required: true,
    ref: "Node",
  },
  weight: {
    type: Number,
    required: true,
    min: 0,
  },
});

const Adjacency = mongoose.model("Adjacency", adjacencySchema);

module.exports = Adjacency;
