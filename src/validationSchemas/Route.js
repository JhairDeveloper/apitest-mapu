const Joi = require("joi");
const Block = require("../models/Block");
const { campusIsValid } = require("./RouteNode");

const blockIsValid = async (block) => {
  const result = await Block.findOne({ _id: block });

  return !!result;
};

const validateNomenclature = async (value, helpers) => {
  const { nomenclature = {} } = value;
  const { campus, block } = nomenclature;

  if (campus) {
    const valid = campusIsValid(campus);

    if (!valid) {
      return helpers.error("any.invalid", {
        message: "El campus indicado no  es válido",
      });
    }
  }

  if (block) {
    const valid = blockIsValid(block);

    if (!valid) {
      return helpers.error("any.invalid", {
        message: "El bloque indicado no es válido",
      });
    }
  }

  return value;
};

// Definir el esquema de validación para la creación de un Nodo de interes
const getNearestRoute = Joi.object({
  type: Joi.string()
    .valid("byNomenclature", "byNode")
    .required()
    .messages({ "*": "Indique el tipo de búsqueda" }),
  destination: Joi.string().required().messages({
    "*": "Se debe seleccionar un lugar de destino",
  }),
  origin: Joi.string().optional().messages({
    "*": "El lugar de origen debe ser un id de nodo",
  }),
  nomenclature: Joi.object({
    campus: Joi.string()
      .required()
      .allow(null)
      .messages({ "*": "Ingrese un campus válido (Ejm. A)" }),
    block: Joi.string()
      .required()
      .allow(null)
      .messages({ "*": "Ingrese un bloque válido (Ejm: 1)" }),
    floor: Joi.number()
      .optional()
      .allow(null)
      .messages({ "*": "Ingrese un piso válido (Ejm: 1)" }),
    environment: Joi.number()
      .optional()
      .allow(null)
      .messages({ "*": "Ingrese un ambiente válido (Ejm: 1)" }),
    subEnvironment: Joi.number()
      .optional()
      .allow(null)
      .messages({ "*": "Ingrese un campus válido (Ejm: 1)" }),
  }).optional(),
})
  .xor("nomenclature", "origin")
  .external(validateNomenclature);

module.exports = {
  getNearestRoute,
};
