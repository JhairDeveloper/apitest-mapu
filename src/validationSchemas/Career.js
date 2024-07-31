const Joi = require("joi");
const { isValidObjectId } = require("mongoose");
const Career = require("../models/Career");
const Faculty = require("../models/Faculty");

const nameIsUnique = async (value, helpers) => {
  const { name, id } = value;
  if (name) {
    const where = { name };
    if (id) where.id = { "!=": id };

    const category = await Career.findOne(where);

    if (category)
      return helpers.error("any.invalid", {
        message: "Ya existe una Carrera con este nombre",
      });
  }

  return value;
};

const idFacultyValid = async (value, helpers) => {
  if (value.faculty) {
    const facultyId = value.faculty;

    if (!isValidObjectId(facultyId)) {
      return helpers.error("any.invalid", {
        message: "El campo faculty debe ser un ObjectId",
      });
    }

    const faculty = await Faculty.findById(facultyId);

    if (!faculty) {
      return helpers.error("any.invalid", {
        message: "Facultad no encontrada",
      });
    }
  }
};

const createCareerSchema = Joi.object({
  name: Joi.string().required().max(100).messages({
    "name.external": "Ya existe una carrera con este nombre",
    "*": "El campo 'name' debe tener un largo máximo de 100 caracteres",
  }),
  description: Joi.string().optional().max(200).messages({
    "*": "El campo 'description' debe tener un largo máximo de 200 carateres",
  }),
  manager: Joi.string().required().max(125).messages({
    "*": "El campo 'manager' debe tener un largo máximo de 125 carateres",
  }),
  faculty: Joi.string().required().messages({
    "*": "Id de facultad no válido",
  }),
})
  .external(idFacultyValid)
  .external(nameIsUnique);

const updateCareerSchema = Joi.object({
  id: Joi.string().required().custom(isValidObjectId).messages({
    "*": "Id no válido",
  }),
  name: Joi.string().optional().max(100).messages({
    "name.external": "Ya existe una carrera con este nombre",
    "*": "El campo 'name' debe tener un largo máximo de 100 caracteres",
  }),
  description: Joi.string().optional().max(200).messages({
    "*": "El campo 'description' debe tener un largo máximo de 200 carateres",
  }),
  manager: Joi.string().optional().max(125).messages({
    "*": "El campo 'manager' debe tener un largo máximo de 125 carateres",
  }),
  faculty: Joi.string().optional().messages({
    "*": "Id de facultad no válido",
  }),
})
  .external(idFacultyValid)
  .external(nameIsUnique);

module.exports = {
  createCareerSchema,
  updateCareerSchema,
};
