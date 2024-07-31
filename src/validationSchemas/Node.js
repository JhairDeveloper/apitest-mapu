const Joi = require("joi");
const Block = require("../models/Block");
const Category = require("../models/Category");
const { MIN_LAT, MAX_LAT, MIN_LON, MAX_LON } = require("../constants");
const { validateCampus } = require("./RouteNode");

const validateBlock = async (value, helpers) => {
  const { block } = value;

  if (block) {
    const result = await Block.findOne({ _id: block });

    if (!result) {
      return helpers.error("any.invalid", {
        message: "El bloque no existe",
      });
    }
  }

  return value;
};

const validateCategory = async (value, helpers) => {
  const { category } = value;

  if (category) {
    const result = await Category.findOne({ _id: category });

    if (!result) {
      return helpers.error("any.invalid", {
        message: "La categoria no existe",
      });
    }
  }

  return value;
};

// Definir el esquema de validación para la creación de un Nodo de interes
const createNodeSchema = Joi.object({
  latitude: Joi.number()
    .required()
    .min(MIN_LAT)
    .max(MAX_LAT)
    .messages({
      "*": `El campo 'latitude' es requerido y debe ser una latitud geográfica válida (De ${MIN_LAT} y ${MAX_LAT})`,
    }),
  longitude: Joi.number()
    .required()
    .min(MIN_LON)
    .max(MAX_LON)
    .messages({
      "*": `El campo 'longitude' es requerido y debe ser una longitud geográfica válida (De ${MIN_LON} y ${MAX_LON})`,
    }),
  available: Joi.boolean().optional().default(true).messages({
    "*": "El campo 'available' es requerido",
  }),
  category: Joi.string().allow(null).optional().messages({
    "*": "El campo 'category' debe ser un id válido",
  }),
  campus: Joi.string().required().messages({
    "*": "El campo 'campus' es requerido y debe ser un id válido",
  }),
  // block: Joi.string().optional().allow(null).messages({
  //   "*": "El campo 'block' debe ser un id válido",
  // }),
  adjacency: Joi.array().optional().items(Joi.string()),
})
  .external(validateCampus)
  .external(validateCategory);

// Definir el esquema de validación para la actualización de un Nodo de interés
const updateNodeSchema = Joi.object({
  id: Joi.string().strip().optional().messages({
    "*": "El campo 'id' presente en la ruta de la petición",
  }),
  _id: Joi.string().strip().optional().messages({
    "*": "El campo 'id' presente en la ruta de la petición",
  }),
  latitude: Joi.number()
    .optional()
    .min(MIN_LAT)
    .max(MAX_LAT)
    .messages({
      "*": `El campo 'latitude' es requerido y debe ser una latitud geográfica válida (De ${MIN_LAT} y ${MAX_LAT})`,
    }),
  longitude: Joi.number()
    .optional()
    .min(MIN_LON)
    .max(MAX_LON)
    .messages({
      "*": `El campo 'longitude' es requerido y debe ser una longitud geográfica válida (De ${MIN_LON} y ${MAX_LON})`,
    }),
  available: Joi.boolean().optional().messages({
    "*": "El campo 'available' es requerido",
  }),
  campus: Joi.string().optional().messages({
    "*": "El campo 'campus' debe ser un id válido",
  }),
  // block: Joi.string().optional().allow(null).messages({
  //   "*": "El campo 'block' debe ser un id válido",
  // }),
  category: Joi.string().allow(null).optional().messages({
    "*": "El campo 'category' debe ser un id válido o null",
  }),
  adjacency: Joi.array().optional().items(Joi.string()),
})
  .external(validateCategory)
  .external(validateBlock)
  .external(validateCampus);

module.exports = {
  createNodeSchema,
  updateNodeSchema,
  validateCategory,
  validateCampus,
};
