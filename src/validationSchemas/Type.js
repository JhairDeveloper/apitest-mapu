const Joi = require("joi");
const mongoose = require("mongoose");

const createTypeSchema = Joi.object({
  name: Joi.string().required().messages({
    "*": "El campo name es requerido y debe tener un largo maximo de 30 caracteres",
  }),
  desc: Joi.string().optional().min(2).max(30).messages({
    "*": "El campo 'desc' es opcional y debe tener un largo maximo de ",
  }),
});

const updateTypeSchema = Joi.object({
  name: Joi.string().required().messages({
    "*": "El campo 'name' es requerido y debe tener un largo maximo de 30 caracteres",
  }),
  desc: Joi.string().optional().messages({
    "*": "El campo 'desc' es opcional y debe tener un largo maximo de 30",
  }),
});

module.exports = {
  createTypeSchema,
  updateTypeSchema,
};
