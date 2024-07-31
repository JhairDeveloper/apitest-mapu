const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const suscriptionSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  eventId: {
    type: Schema.Types.ObjectId,
    ref: "events",
    required: true,
  },
});

const Suscription = mongoose.model("suscriptions", suscriptionSchema);
module.exports = Suscription;
