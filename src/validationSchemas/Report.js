const Joi = require("joi");
const mongoose = require("mongoose");
const { MIN_LAT, MAX_LAT, MIN_LON, MAX_LON } = require("../constants");
const ObjectId = mongoose.Types.ObjectId;

// Definir el esquema de validación para la creación de un Reporte
const createReportSchema = Joi.object({
  node: Joi.string()
    .custom((value, helpers) => {
      if (!ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    })
    .allow(null)
    .allow("")
    .optional()
    .messages({
      "*": "El campo 'node' debe ser un ID válido",
    }),
  subnode: Joi.string()
    .custom((value, helpers) => {
      if (!ObjectId.isValid(value)) {
        return helpers.error("any.invalid");
      }
      return value;
    })
    .allow(null)
    .allow("")
    .optional()
    .messages({
      "*": "El campo 'subnode' debe ser un ID válido",
    }),
  lostPoint: Joi.object({
    latitude: Joi.number()
      //   .required()
      .min(MIN_LAT)
      .max(MAX_LAT)
      .allow(null)
      .messages({
        "*": `El campo 'latitude' es requerido y debe ser una latitud geográfica válida (De ${MIN_LAT} y ${MAX_LAT})`,
      }),
    longitude: Joi.number()
      //   .required()
      .min(MIN_LON)
      .max(MAX_LON)
      .allow(null)
      .messages({
        "*": `El campo 'longitude' es requerido y debe ser una longitud geográfica válida (De ${MIN_LON} y ${MAX_LON})`,
      }),
  })
    .optional()
    .allow(null)
    .messages({
      "*": "El campo 'lostPoint' es opcional y debe ser un objeto con las propiedades 'latitude' y 'longitude'",
    }),
  comment: Joi.string().required().messages({
    "*": "El campo 'comment' es requerido",
  }),
});

// Definir el esquema de validación para la actualización de un Reporte
const updateReportSchema = Joi.object({
  id: Joi.string().strip().messages({
    "*": "El campo 'id' presente en la ruta de la petición. Se valida y se elimina el id",
  }),
  revised: Joi.boolean().required().messages({
    "*": "El campo 'revised' es requerido",
  }),
});

module.exports = {
  createReportSchema,
  updateReportSchema,
};
