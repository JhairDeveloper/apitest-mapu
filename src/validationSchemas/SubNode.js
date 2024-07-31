const Joi = require("joi");
const { isValidObjectId } = require("mongoose");
const { validateCategory } = require("./Node");
const Campus = require("../models/Campus");
const Block = require("../models/Block");
const { MIN_LAT, MAX_LAT, MIN_LON, MAX_LON } = require("../constants");
const Detail = require("../models/Detail");
const Category = require("../models/Category");

const validateCampus = async (campus) => {
  if (!isValidObjectId(campus)) return false;

  const campusDB = await Campus.findOne({ _id: campus });

  return !!campusDB;
};

const validateBlock = async (block) => {
  if (!isValidObjectId(block)) return false;

  const blockDB = await Block.findOne({ _id: block });

  return !!blockDB;
};

const validateNomenclature = async (value, helpers) => {
  const { nomenclature = {} } = value;
  const { campus, block } = nomenclature;

  if (campus) {
    const campusIsValid = await validateCampus(campus);

    if (!campusIsValid) {
      return helpers.error("any.invalid", {
        message: "El campus no existe",
      });
    }
  }

  if (block) {
    const blockIsValid = await validateBlock(block);

    if (!blockIsValid) {
      return helpers.error("any.invalid", {
        message: "El bloque no existe",
      });
    }
  }

  return value;
};

const detailIsValid = async (detail) => {
  const result = await Detail.findOne({ _id: detail });

  return !!result;
};

const categoryIsValid = async (category) => {
  const result = await Category.findOne({ _id: category });

  return !!result;
};

const createSubNodeSchema = Joi.object({
  latitude: Joi.number()
    .required()
    .min(MIN_LAT)
    .max(MAX_LAT)
    .messages({
      "*": `El campo 'latitude' es requerido y debe ser una latitud geográfica válida (De ${MIN_LAT} y ${MAX_LAT})`,
    }),
  longitude: Joi.number()
    .required()
    .min(MIN_LON)
    .max(MAX_LON)
    .messages({
      "*": `El campo 'longitude' es requerido y debe ser una longitud geográfica válida (De ${MIN_LON} y ${MAX_LON})`,
    }),
  name: Joi.string().required().messages({
    "*": "El campo name es requerido ",
  }),
  description: Joi.string().optional().allow(null).allow("").messages({
    "*": "El campo description es requerido ",
  }),
  img: Joi.string().optional().allow(null).uri().messages({
    "*": "El campo 'img' es requerido y debe ser una url válida",
  }),
  category: Joi.string().allow(null).optional().messages({
    "*": "El campo 'category' debe ser un id válido",
  }),
  nomenclature: Joi.object({
    //!  No le puedo pedir estos datos pq debe ser el mismo campus y el bloque recién se va a crear
    // campus: Joi.string().required().messages({
    //   "*": "El campo nomenclature.campus es requerido ",
    // }),
    // block: Joi.string().required().messages({
    //   "*": "El campo nomenclature.block es requerido",
    // }),
    floor: Joi.number().messages({
      "*": "El campo nomenclature.floor es requerido",
    }),
    environment: Joi.number().allow(null).required().messages({
      "*": "El campo nomenclature.environment es requerido",
    }),
    subEnvironment: Joi.number().allow(null).optional().messages({
      "*": "El campo nomenclature.subEnvironment debe ser un número o null",
    }),
  })
    .required()
    .messages({ "*": "El campo subnode.nomenclature es un objeto requerido" }),
})
  .external(validateCategory)
  .external(validateNomenclature);

const updateSubNodeSchema = Joi.object({
  id: Joi.string().optional().messages({
    "*": "Id no válido",
  }),
  _id: Joi.string().optional().messages({
    "*": "Id no válido",
  }),
  latitude: Joi.number()
    .optional()
    .min(MIN_LAT)
    .max(MAX_LAT)
    .messages({
      "*": `El campo 'latitude' es requerido y debe ser una latitud geográfica válida (De ${MIN_LAT} y ${MAX_LAT})`,
    }),
  longitude: Joi.number()
    .optional()
    .min(MIN_LON)
    .max(MAX_LON)
    .messages({
      "*": `El campo 'longitude' es requerido y debe ser una longitud geográfica válida (De ${MIN_LON} y ${MAX_LON})`,
    }),
  name: Joi.string().optional().messages({
    "*": "El campo name es requerido ",
  }),
  description: Joi.string().optional().allow(null).allow("").messages({
    "*": "El campo description debe ser un string ",
  }),
  img: Joi.string().optional().uri().allow(null).messages({
    "*": "El campo 'img' es requerido y debe ser una url válida",
  }),
  category: Joi.string().allow(null).optional().messages({
    "*": "El campo 'category' debe ser un id válido",
  }),
  nomenclature: Joi.object({
    // campus: Joi.string().optional().messages({
    //   "*": "El campo nomenclature.campus es requerido ",
    // }),
    // block: Joi.string().optional().messages({
    //   "*": "El campo nomenclature.block es requerido",
    // }),
    floor: Joi.number().messages({
      "*": "El campo nomenclature.floor es requerido",
    }),
    environment: Joi.number().optional().allow(null).messages({
      "*": "El campo nomenclature.environment debe ser un número o null",
    }),
    subEnvironment: Joi.number().optional().allow(null).messages({
      "*": "El campo nomenclature.subEnvironment debe ser un número o null",
    }),
  })
    .optional()
    .messages({ "*": "El campo subnode.nomenclature debe ser un objeto" }),
})
  .external(validateCategory)
  .external(validateNomenclature);

module.exports = {
  createSubNodeSchema,
  updateSubNodeSchema,
  detailIsValid,
  categoryIsValid,
};
