const Joi = require("joi");
const {
  createNodeSchema,
  validateCampus,
  validateCategory,
  updateNodeSchema,
} = require("./Node");
const { createSubNodeSchema, updateSubNodeSchema } = require("./SubNode");

const createDetailSchema = Joi.object({
  title: Joi.string().required().max(50).messages({
    "*": "El campo 'title' es requerido y debe tener hasta 50 caracteres",
  }),
  description: Joi.string().allow(null).allow("").max(150).messages({
    "*": "El campo 'description' debe tener hasta 150 caracteres",
  }),
  img: Joi.string().optional().uri().allow(null).messages({
    "*": "El campo 'img' debe ser una url válida o null",
  }),
  subnodes: Joi.array().optional().items(createSubNodeSchema).messages({
    "*": "El campo detail.subnodes debe ser un array de subnodos",
  }),
});

const updateDetailSchema = Joi.object({
  _id: Joi.string().required().messages({
    "*": "El campo '_id' del detalle es requerido",
  }),
  title: Joi.string().optional().max(50).messages({
    "*": "El campo 'title' debe tener hasta 50 caracteres",
  }),
  description: Joi.string().optional().allow(null).allow("").max(150).messages({
    "*": "El campo 'description' debe tener hasta 150 caracteres",
  }),
  img: Joi.string().optional().uri().allow(null).messages({
    "*": "El campo 'img' debe ser una url válida o null",
  }),
  subnodes: Joi.array().optional().items(updateSubNodeSchema),
});

// Definir el esquema de validación para la creación de un Nodo de interes
const createNodeWithDetailSchema = createNodeSchema
  .keys({
    detail: createDetailSchema
      .required()
      .messages({ "*": "El campo node.detail es requerido" }),
  })
  .external(validateCampus)
  .external(validateCategory);

// Definir el esquema de validación para la actualización de un Nodo de interés
const updateNodeWithDetailSchema = updateNodeSchema
  .keys({
    detail: updateDetailSchema.optional(),
  })
  .external(validateCategory)
  .external(validateCampus);

module.exports = {
  createNodeWithDetailSchema,
  updateNodeWithDetailSchema,
  createDetailSchema,
  updateDetailSchema,
};
