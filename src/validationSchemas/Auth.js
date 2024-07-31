const Joi = require("joi");

const registerUserSchema = Joi.object({
  name: Joi.string().required().min(3).max(25).messages({
    "*": "El campo name es requerido y debe tener entre 3 y 25 caracteres",
  }),
  lastname: Joi.string().required().min(3).max(25).messages({
    "*": "El campo lastname es requerido y debe tener entre 3 y 25 caracteres",
  }),
  email: Joi.string().email().required().messages({
    "*": "El campo email debe ser un email válido",
  }),
  avatar: Joi.string().optional().messages({
    "*": "El campo avatar es invalido",
  }),
  password: Joi.string().required().min(8).alphanum().max(30).messages({
    "*": "El campo password es requerido y debe tener entre 8 y 30 caracteres alfanuméricos",
  }),
  role: Joi.string().optional().messages({
    "*": "El campo role es opcional",
  }),
});

const loginSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({ "*": "El campo email es requerido" }),
  password: Joi.string()
    .required()
    .messages({ "*": "La contraseña es requerida" }),
});

const recoverPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "*" : "El campo email es requerido"
  })
});

module.exports = { registerUserSchema, loginSchema, recoverPasswordSchema };
