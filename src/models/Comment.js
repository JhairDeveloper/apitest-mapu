const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const commentSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  hide: {
    type: Boolean,
    required: true,
    default: false,
  },
  user: {
    type: Schema.Types.ObjectId, // Tipo ObjectId para referencia
    ref: "users", // Nombre del modelo referenciado
    required: true,
  },
  node: {
    type: Schema.Types.ObjectId, // Tipo ObjectId para referencia
    ref: "Node", // Nombre del modelo referenciado
    required: true,
  },
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
