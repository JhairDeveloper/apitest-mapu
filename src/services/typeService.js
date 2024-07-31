const { isValidObjectId } = require("mongoose");
const Type = require("../models/Type");
const ValidationError = require("../errors/ValidationError");

const createType = async (typeData) => {
  const type = await Type.create(typeData);
  return type;
};

const getTypes = async (where = {}, skip, limit) => {
  const types = await Type.find(where).skip(skip).limit(limit);
  return types;
};

const getType = async (id) => {
  const type = await Type.findById(id);
  return type;
};

const getCountTypes = async (where = {}) => {
  const numberTypes = await Type.count(where);
  return numberTypes;
};

const getTypeById = async (_id) => {
  if (!isValidObjectId(_id))
    throw new ValidationError("El id debe ser un ObjectId");

  const type = await Type.findOne({ _id });
  if (!type) {
    throw new ValidationError("Tipo de nodo no encontrado");
  }

  return type;
};

const getOneType = async (where = {}) => {
  const type = await Type.findOne(where);

  if (!type) {
    throw new ValidationError("Tipo de nodo no encontrado");
  }

  return type;
};

const updateTypeById = async (_id, newInformation) => {
  let type = await getTypeById(_id);

  type = await Type.updateOne({ _id }, newInformation);

  return type;
};

const deleteTypeById = async (_id) => {
  if (!isValidObjectId(_id)) {
    throw new ValidationError("El id debe ser un ObjectId");
  }
  const deleteType = await Type.findByIdAndDelete(_id);
  if (!deleteType) throw new ValidationError("Type no encontrado");
};

module.exports = {
  createType,
  getType,
  getTypes,
  getCountTypes,
  getTypeById,
  updateTypeById,
  deleteTypeById,
  getOneType,
};
