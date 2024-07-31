const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const reportSchema = new Schema({
  node: {
    type: Schema.Types.ObjectId,
    ref: "Node",
    required: false,
    default: null,
  },
  subnode: {
    type: Schema.Types.ObjectId,
    ref: "subnode",
    required: false,
    default: null,
  },
  lostPoint: {
    type: Schema.Types.ObjectId,
    ref: "LostPoint",
    required: false,
    default: null,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  comment: {
    type: String,
    required: true,
    maxLength: 300,
  },
  revised: {
    type: Boolean,
    default: false,
  },
});

reportSchema.set("toJSON", {
  transform: function (doc, ret) {
    ret.type = ret.lostPoint ? "Punto perdido" : "Punto desactualizado";
  },
});

const Report = mongoose.model("Report", reportSchema);

module.exports = Report;
