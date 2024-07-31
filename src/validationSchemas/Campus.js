const Joi = require("joi");
const Campus = require("../models/Campus");
const { isValidObjectId } = require("mongoose");

const nameIsUnique = async (value, helpers) => {
  const { name, id } = value;
  if (name) {
    const where = { name };
    if (id) where.id = { "!=": id };

    const campus = await Campus.findOne(where);

    if (campus)
      return helpers.error("any.invalid", {
        message: "Ya existe un Campus con este nombre",
      });
  }

  return value;
};

const symbolIsUnique = async (value, helpers) => {
  const { symbol, id } = value;

  if (symbol) {
    const where = { symbol };
    if (id) where.id = { "!=": id };

    const campus = await Campus.findOne(where);

    if (campus)
      return helpers.error("any.invalid", {
        message: "Ya existe un Campus con este símbolo",
      });
  }

  return value;
};

const createCampusSchema = Joi.object({
  name: Joi.string().required().max(70).messages({
    "string.external": "Ya existe un Campus con ese nombre",
    "*": "El campo 'name' es requerido y debe tener un largo máximo de 70 caracteres",
  }),
  symbol: Joi.string().required().max(2).external(symbolIsUnique).messages({
    "name.external": "Ya existe un campus con este símbolo",
    "*": "El campo 'symbol' es requerido y debe tener máximo 2 caracteres",
  }),
  description: Joi.string().optional().max(300).messages({
    "*": "El campo 'description' debe tener un largo máximo de 300 caracteres",
  }),
  address: Joi.string().required().max(300).messages({
    "*": "El campo 'address' es requerido y debe tener un largo máximo de 300 caracteres",
  }),
  polygon: Joi.array().optional(),
  // accessPoints: Joi.array().required().messages({
  //   "*": "El campo accessPoint debe ser un array de coordenadas",
  // }),
})
  .external(nameIsUnique)
  .external(symbolIsUnique);

const updateCampusSchema = Joi.object({
  id: Joi.string().required().custom(isValidObjectId).messages({
    "*": "Id no válido",
  }),
  name: Joi.string().optional().max(70).external(nameIsUnique).messages({
    "name.external": "Ya existe un campus con este nombre",
    "*": "El campo 'name' debe tener un largo máximo de 70 caracteres",
  }),
  symbol: Joi.string().optional().max(2).external(symbolIsUnique).messages({
    "name.external": "Ya existe un campus con este símbolo",
    "*": "El campo 'symbol' debe tener un largo máximo de 2 caracteres",
  }),
  description: Joi.string().optional().max(300).messages({
    "*": "El campo 'description' debe tener un largo máximo de 300 caracteres",
  }),
  address: Joi.string().optional().max(300).messages({
    "*": "El campo 'address' debe tener un largo máximo de 300 caracteres",
  }),
  polygon: Joi.array().optional(),
  // accessPoints: Joi.array().optional().messages({
  //   "*": "El campo accessPoint debe ser un array",
  // }),
})
  .external(nameIsUnique)
  .external(symbolIsUnique);

module.exports = {
  createCampusSchema,
  updateCampusSchema,
};
