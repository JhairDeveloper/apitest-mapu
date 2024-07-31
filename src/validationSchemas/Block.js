const Joi = require("joi");
const mongoose = require("mongoose");
const {
  createNodeWithDetailSchema,
  updateNodeWithDetailSchema,
} = require("./NodeWithDetail");
const ObjectId = mongoose.Types.ObjectId;

const isJoiValidObjectId = (value, helpers) => {
  if (!ObjectId.isValid(value)) {
    return helpers.error("any.invalid");
  }

  return value;
};

// Definir el esquema de validación para la creación de un bloque
const createBlockSchema = Joi.object({
  number: Joi.number().required().messages({
    "*": "El campo 'number' es requerido",
  }),
  available: Joi.boolean().default(true).messages({
    "*": "El campo 'available' es requerido y por defecto es 'true'",
  }),
  faculty: Joi.string().custom(isJoiValidObjectId).required().messages({
    "*": "El campo 'faculty' es requerido y debe ser un ID válido",
  }),
  campus: Joi.string().custom(isJoiValidObjectId).required().messages({
    "*": "El campo 'campus' es requerido y debe ser un ID válido",
  }),
  node: createNodeWithDetailSchema
    .required()
    .messages({ "*": "El campo 'node' es requerido y debe ser un objeto" }),
});

// Definir el esquema de validación para la actualización de un bloque
const updateBlockSchema = Joi.object({
  id: Joi.string().strip().required().messages({
    "*": "El campo 'id' es requerido",
  }),
  number: Joi.number().optional().messages({
    "*": "El campo 'number' es opcional", //? Posible error por usar una palabra reservada
  }),
  available: Joi.boolean().optional().default(true).messages({
    "*": "El campo 'available' es opcional y por defecto es 'true'",
  }),
  faculty: Joi.string().custom(isJoiValidObjectId).optional().messages({
    "*": "El campo 'faculty' es requerido y debe ser un ID válido",
  }),
  campus: Joi.string().custom(isJoiValidObjectId).optional().messages({
    "*": "El campo 'campus' es requerido y debe ser un ID válido",
  }),
  node: updateNodeWithDetailSchema.optional(),
});

module.exports = {
  createBlockSchema,
  updateBlockSchema,
  isJoiValidObjectId,
};
