const Joi = require("joi");
const Campus = require("../models/Campus");
const { MIN_LAT, MAX_LAT, MIN_LON, MAX_LON } = require("../constants");

const campusIsValid = async (campus) => {
  const result = await Campus.findOne({ _id: campus });

  return !!result;
};

const validateCampus = async (value, helpers) => {
  const { campus } = value;

  if (campus) {
    const isValid = await campusIsValid(campus);

    if (!isValid) {
      return helpers.error("any.invalid", {
        message: "El campus no existe",
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
      "*": `El campo 'latitude' es requerido y debe ser una longitud geográfica válida (De ${MIN_LON} y ${MAX_LON})`,
    }),
  available: Joi.boolean().required().messages({
    "*": "El campo 'available' es requerido",
  }),

  campus: Joi.string().required().messages({
    "*": "El campo 'campus' es requerido y debe ser un id válido o null",
  }),
  adjacency: Joi.array().optional().items(Joi.string()),
}).external(validateCampus);

// Definir el esquema de validación para la actualización de un Nodo de interés
const updateNodeSchema = Joi.object({
  id: Joi.string().strip().messages({
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
      "*": `El campo 'latitude' es requerido y debe ser una longitud geográfica válida (De ${MIN_LON} y ${MAX_LON})`,
    }),
  available: Joi.boolean().optional().messages({
    "*": "El campo 'available' es requerido",
  }),
  campus: Joi.string().optional().messages({
    "*": "El campo 'campus' debe ser un id válido",
  }),
  adjacency: Joi.array().optional().items(Joi.string()),
}).external(validateCampus);

module.exports = {
  createNodeSchema,
  updateNodeSchema,
  validateCampus,
  campusIsValid,
};
