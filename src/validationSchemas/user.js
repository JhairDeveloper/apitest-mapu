const Joi = require("joi");
const { isValidObjectId } = require("mongoose");

const createUserSchema = Joi.object({
  name: Joi.string().required().min(3).max(25).messages({
    "*": "El campo name es requerido y debe tener entre 3 y 25 caracteres",
  }),
  lastname: Joi.string().required().min(3).max(25).messages({
    "*": "El campo lastname es requerido y debe tener entre 3 y 25 caracteres",
  }),
  email: Joi.string().required().min(5).max(30).messages({
    "*": "El campo email es requerido y debe tener entre 5 y 30 caracteres",
  }),
  avatar: Joi.string().optional().messages({
    "*": "El campo avatar es invalido",
  }),
  password: Joi.string().required().min(5).max(30).messages({
    "*": "El campo password es requerido y debe tener entre 5 y 30 caracteres",
  }),
  settings: Joi.object({
    notification: Joi.boolean().optional().messages({
      "*": "El campo nitification es opcional y bede ser un boolean",
    }),
    spam: Joi.boolean().optional().messages({
      "*": "El campo spam debe ser un boolean y es opcional",
    }),
  }),
  role: Joi.string().optional().messages({
    "*": "El campo role debe ser de Object tipe Id",
  }),
});

const editUserSchema = Joi.object({
  id: Joi.string().optional().custom(isValidObjectId).messages({
    "*": "Id no válido",
  }),
  name: Joi.string().optional().min(3).max(25).messages({
    "*": "El campo name es requerido y debe tener entre 3 y 25 caracteres",
  }),
  lastname: Joi.string().optional().min(3).max(25).messages({
    "*": "El campo lastname es requerido y debe tener entre 3 y 25 caracteres",
  }),
  email: Joi.string().email().optional().messages({
    "*": "El campo email debe ser un email válido",
  }),
  avatar: Joi.string().optional().messages({
    "*": "El campo avatar es invalido",
  }),
  password: Joi.string().optional().min(8).alphanum().max(30).messages({
    "*": "El campo password es requerido y debe tener entre 8 y 30 caracteres alfanuméricos",
  }),
  settings: Joi.object({
    notification: Joi.boolean().optional().messages({
      "*": "El campo nitification es opcional y bede ser un boolean",
    }),
    spam: Joi.boolean().optional().messages({
      "*": "El campo spam debe ser un boolean y es opcional",
    }),
  }),
  role: Joi.string().optional().messages({
    "*": "El campo role es opcional",
  }),
  bloqued: Joi.boolean().optional().messages({
    "*": "El campo bloqued debe ser un booleano",
  }),
});

module.exports = { createUserSchema, editUserSchema };
