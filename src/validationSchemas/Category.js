const Joi = require("joi");
const { isValidObjectId } = require("mongoose");
const Category = require("../models/Category");

const nameIsUnique = async (value, helpers) => {
  const { name, id } = value;
  if (name) {
    const where = { name };
    if (id) where.id = { "!=": id };

    const category = await Category.findOne(where);

    if (category)
      return helpers.error("any.invalid", {
        message: "Ya existe una Categoria con este nombre",
      });
  }

  return value;
};

const createCategorySchema = Joi.object({
  name: Joi.string().required().max(50).messages({
    "name.external": "Ya existe una categoria con este nombre",
    "*": "El campo 'name' debe tener un largo máximo de 50 caracteres",
  }),
  description: Joi.string().optional().max(200).messages({
    "*": "El campo 'description' debe tener un largo máximo de 200 caracteres",
  }),
  icon: Joi.string().required().messages({
    "*": "El campo 'icon' es requerido",
  }),
}).external(nameIsUnique);

const updateCategorySchema = Joi.object({
  id: Joi.string().required().custom(isValidObjectId).messages({
    "*": "Id no válido",
  }),
  name: Joi.string().optional().max(50).external(nameIsUnique).messages({
    "name.external": "Ya existe una categoria con este nombre",
    "*": "El campo 'name' debe tener un largo máximo de 50 caracteres",
  }),
  description: Joi.string().optional().max(200).messages({
    "*": "El campo 'description' debe tener un largo máximo de 200 caracteres",
  }),
  icon: Joi.string().optional().messages({
    "*": "El campo 'icon' es invalido",
  }),
}).external(nameIsUnique);

module.exports = {
  createCategorySchema,
  updateCategorySchema
};