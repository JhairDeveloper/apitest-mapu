const Joi = require("joi");

// Definir el esquema de validación para la creación de un Evento
const createEventSchema = Joi.object({
  name: Joi.string().required().messages({
    "*": "El campo 'Nombre' es requerido",
  }),
  node: Joi.string().allow("").messages({
    "*": "El campo 'node' debe ser un string",
  }),
  sinceDate: Joi.date().required().messages({
    "*": "El campo 'Fecha de inicio' es requerido",
  }),
  untilDate: Joi.date().required().messages({
    "*": "El campo 'Fecha de terminación' es requerido",
  }),
  description: Joi.string().optional().messages({
    "*": "El campo 'Descripción' es opcional",
  }),
  price: Joi.number().precision(2).required().messages({
    "*": "El campo 'Precio' es requerido y tiene una precisión de 2 (por ejemplo, 10.99, 5.50)",
  }),
  img: Joi.string().optional().messages({
    "*": "El campo 'Imagen' debe ser una cadena string y es opcional",
  }),
});

// Definir el esquema de validación para la actualización de un Event
const updateEventSchema = Joi.object({
  id: Joi.string().strip().messages({
    "*": "El campo 'id' presente en la ruta de la petición. Se valida y se elimina el id",
  }),
  name: Joi.string().optional().messages({
    "*": "El campo 'Nombre' es opcional",
  }),
  node: Joi.string().messages({
    "*": "El campo 'node' debe ser un string",
  }),
  sinceDate: Joi.date().optional().messages({
    "*": "El campo 'Fecha de inicio' es opcional",
  }),
  untilDate: Joi.date().optional().messages({
    "*": "El campo 'Fecha de terminacion' es opcional",
  }),
  description: Joi.string().optional().messages({
    "*": "El campo 'descripcion' es opcional",
  }),
  price: Joi.number().precision(2).optional().messages({
    "*": "El campo 'Precio' es opcional y tiene una precisión de 2 (por ejemplo, 10.99, 5.50)",
  }),
  img: Joi.string().optional().messages({
    "*": "El campo 'Img' debe ser una cadena string y es opcional",
  }),
});

module.exports = {
  createEventSchema,
  updateEventSchema,
};
