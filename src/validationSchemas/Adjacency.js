const Joi = require("joi");
const { OBJECT_ID_REGEX } = require("../constants");

const createAdjacencySchema = Joi.object({
  origin: Joi.string()
    .optional()
    .regex(OBJECT_ID_REGEX)
    .allow(null)
    .messages({ "*": "Id de 'origin' no válido" }),
  destination: Joi.string()
    .optional()
    .regex(OBJECT_ID_REGEX)
    .allow(null)
    .messages({ "*": "Id de 'destination' no válido" }),
  nodes: Joi.array()
    .optional()
    .allow(null)
    .items(
      Joi.object({
        _id: Joi.string()
          .required()
          .regex(OBJECT_ID_REGEX)
          .messages({ "*": "Id de adyacencia no válido" }),
        toDelete: Joi.array(),
        adjacencies: Joi.array()
          .required()
          .min(1)
          .items(Joi.object())
          .messages({
            "*": "El array de adyacencias debe tener al menos un id",
          }),
      })
    )
    .messages({ "*": "El campo 'nodes' contiene errores" }),
})
  .with("origin", "destination")
  .messages({
    "object.with":
      "Cuando el campo 'origin' está presente, el campo 'destination' es requerido",
    "*": "Revise el cuerpo de la petición enviada",
  });

const deleteAdjacenciesSchema = Joi.object({
  adjacencies: Joi.array()
    .required()
    .items(
      Joi.string()
        .regex(OBJECT_ID_REGEX)
        .messages({ "*": "Id de adyacencia no válido" })
    )
    .min(1)
    .messages({ "*": "El array de adyacencias es requerido" }),
});

module.exports = { createAdjacencySchema, deleteAdjacenciesSchema };
