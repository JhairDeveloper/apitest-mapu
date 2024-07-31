const Joi = require("joi");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

// Definir el esquema de validación para la creación de un comentario
const createCommentSchema = Joi.object({
  content: Joi.string().required().messages({
    "*": "El campo 'content' es requerido",
  }),
  user: Joi.string()
    .custom((value, helpers) => {
      if (!ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    })
    .required()
    .messages({
      "*": "El campo 'user' es requerido y debe ser un ID válido",
    }),
  node: Joi.string()
    .custom((value, helpers) => {
      if (!ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    })
    .required()
    .messages({
      "*": "El campo 'user' es requerido y debe ser un ID válido",
    }),
});

// Definir el esquema de validación para la actualización de un comentario
const updateCommentSchema = Joi.object({
  id: Joi.string().strip().messages({
    "*": "El campo 'id' presente en la ruta de la petición. Se valida y se elimina el id",
  }),
  hide: Joi.boolean().required().messages({
    "*": "El campo 'hide' es requerido, de tipo Boolean",
  }),
});


module.exports = {
  createCommentSchema,
  updateCommentSchema
};
