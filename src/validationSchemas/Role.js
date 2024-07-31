const Joi = require("joi");

const createRoleSchema = Joi.object({
  name: Joi.string().required().min(2).max(30).messages({
    "*": "El campo 'name' es requerido y debe contener de 2 a 30 caracteres",
  }),
});

module.exports = {
  createRoleSchema,
};
