const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const failedRequestSchema = new Schema({
  url: { type: String, required: true },
  method: { type: String, required: true },
  message: { type: String, required: false, default: null },
  params: { type: mongoose.Schema.Types.Mixed, required: false },
  queries: { type: mongoose.Schema.Types.Mixed, required: false },
  body: { type: mongoose.Schema.Types.Mixed, required: false },
  statusCode: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const FailedRequest = mongoose.model("FailedRequest", failedRequestSchema);

module.exports = FailedRequest;
