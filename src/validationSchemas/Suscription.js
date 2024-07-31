const Joi = require("joi");
const mongoose = require("mongoose");
const ObjecId = mongoose.Types.ObjectId;

const createSuscriptionSchema = Joi.object({
  eventId: Joi.string()
    .custom((value, helpers) => {
      if (!ObjecId.isValid(value)) {
        return helpers.error("InvalidoobjectId");
      }
      return value;
    })
    .required()
    .messages({
      "*": "El campo eventId es requido y debe ser un id valido",
    }),
});

const updateSuscriptionSchema = Joi.object({
  id: Joi.string().messages({
    "*": "El campo 'id' debe ser requerido",
  }),
  userId: Joi.string()
    .custom((value, helpers) => {
      if (!ObjecId.isValid(value)) {
        return helpers.error("InvalidoobjectId");
      }
      return value;
    })
    .required()
    .messages({
      "*": "El campo userId es requido y debe ser un id valido",
    }),
  eventId: Joi.string()
    .custom((value, helpers) => {
      if (!ObjecId.isValid(value)) {
        return helpers.error("InvalidoobjectId");
      }
      return value;
    })
    .required()
    .messages({
      "*": "El campo eventId es requido y debe ser un id valido",
    }),
});

module.exports = {
  createSuscriptionSchema,
  updateSuscriptionSchema,
};
