const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const lostPointSchema = new Schema({
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
});

lostPointSchema.set("toJSON", {
  transform: function (doc, ret) {
    ret.coordinate = [ret.latitude, ret.longitude];
  },
});

const LostPoint = mongoose.model("LostPoint", lostPointSchema);

module.exports = LostPoint;
