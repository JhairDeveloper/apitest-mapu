const Joi = require("joi");
const { isValidPolygon } = require("../helpers");
const Faculty = require("../models/Faculty");
const { isValidObjectId } = require("mongoose");

const nameIsUnique = async (value, helpers) => {
  const { name, id } = value;
  if (name) {
    const where = { name };
    if (id) where.id = { "!=": id };

    const faculty = await Faculty.findOne(where);

    if (faculty)
      return helpers.error("any.invalid", {
        message: "Ya existe una facultad con este nombre",
      });
  }

  return value;
};

// Definir el esquema de validación
const createFacultySchema = Joi.object({
  name: Joi.string().required().min(5).max(150).messages({
    "string.external": "Ya existe una facultad con este nombre",
    "*": "El campo 'name' es requerido y debe tener entre 5 y 150 caracteres",
  }),
  description: Joi.string().allow("", null).optional().max(200).messages({
    "*": "El campo 'description' debe tener un máximo de 200 caracteres",
  }),
  dean: Joi.string().allow("", null).optional().max(150).messages({
    "*": "El campo 'dean' debe tener un máximo de 150 caracteres",
  }),
  polygons: Joi.required()
    .custom((polygons, helpers) => {
      if (!Array.isArray(polygons)) return helpers.error("any.invalid");

      for (const polygon of polygons) {
        if (!isValidPolygon(polygon)) return helpers.error("any.invalid");
      }

      return polygons;
    })
    .messages({ "*": "El campo 'polygons' debe ser un array de polígonos" }),
}).external(nameIsUnique);

// Definir el esquema de validación
const updateFacultySchema = Joi.object({
  name: Joi.string()
    .optional()
    .min(5)
    .max(150)
    .external(nameIsUnique)
    .messages({
      "name.external": "Ya existe una facultad con este nombre",
      "*": "El campo 'name' debe ser un string de entre 5 y 150 caracteres",
    }),
  description: Joi.string().allow("", null).optional().max(200).messages({
    "*": "El campo 'description' debe tener un máximo de 200 caracteres",
  }),
  dean: Joi.string().allow("", null).optional().max(150).messages({
    "*": "El campo 'dean' debe tener un máximo de 150 caracteres",
  }),
  id: Joi.string()
    .required()
    .custom(isValidObjectId)
    .messages({ "*": "Id no válido" }),
  polygons: Joi.optional()
    .custom((polygons, helpers) => {
      if (!Array.isArray(polygons)) return helpers.error("any.invalid");

      for (const polygon of polygons) {
        if (!isValidPolygon(polygon)) return helpers.error("any.invalid");
      }

      return polygons;
    })
    .messages({
      "*": "El campo 'polygons' debe ser un array de polígonos geográficos",
    }),
}).external(nameIsUnique);

module.exports = {
  createFacultySchema,
  updateFacultySchema,
};
