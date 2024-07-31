const SubNode = require("../models/SubNode.js");
const ValidationError = require("../errors/ValidationError.js");
const { isValidObjectId } = require("mongoose");
const validateSubNodeExcelFile = require("../helpers/validateSubNodeFile.js");
const { uploadImageToS3 } = require("../helpers/s3Helpers");

const mapSubNode = (row) => {
  const result = {};
  
  result.name = row.NOMBRE;
  result.description = row.DESCRIPCION;
  result.detail = row.DETALLE;
  result.img = row.IMAGEN;
  result.latitude = row.LATITUD;
  result.longitude = row.LONGITUD;
  result.category = row.CATEGORIA;
  result.nomenclature = {
    floor: row.PISO,
    environment: row.AMBIENTE,
    subEnvironment: row.SUBAMBIENTE
  };

  return result;
};

const getSubNodeById = async (_id) => {
  if (!isValidObjectId(_id)) {
    throw new ValidationError("El id debe ser un ObjectId");
  }

  const subNode = await SubNode.findOne({ _id }).populate("category");

  if (!subNode) {
    throw new ValidationError("Subnodo no encontrado");
  }

  return subNode;
};

const getAllSubNodes = async (where = {}, skip, limit) => {
  const allSubNodes =
    skip || limit
      ? await SubNode.find(where).skip(skip).limit(limit).populate("category")
      : await SubNode.find(where).populate("category");

  return allSubNodes;
};

const getCountSubNodes = async (where = {}) => {
  return SubNode.count(where);
};

const createSubNode = async (subNode) => {
  const subNodeCreated = await SubNode.create(subNode);

  return subNodeCreated;
};

const updateSubNode = async (_id, newInformatiion) => {
  if (!isValidObjectId(_id)) {
    throw new ValidationError("El id debe ser un ObjectId");
  }
  const subNode = await SubNode.updateOne({ _id }, newInformatiion);
  return subNode;
};

const deleteSubNode = async (_id) => {
  if (!isValidObjectId(_id)) {
    throw new ValidationError("El id debe ser un Object id");
  }
  const deleteSubNode = SubNode.deleteOne({ _id });
  if (!deleteSubNode) throw ValidationError("Subnodo no encontrado");

  return deleteSubNode;
};

const masiveUpload = async (file) => {
  const { valid, errorsFile, rows } = await validateSubNodeExcelFile(file);
  
  if (valid) {
    const results = await Promise.all(
      rows.map(async (row) => {
        return await createSubNode(mapSubNode(row));
      })
    );

    return { valid, results };
  } else {
    const { Location: errorsURL } = await uploadImageToS3(
      errorsFile,
      "xlsx",
      "validations",
      true
    );
      
    return { valid, errorsURL };
  }
};

module.exports = {
  getAllSubNodes,
  getSubNodeById,
  updateSubNode,
  createSubNode,
  deleteSubNode,
  getCountSubNodes,
  masiveUpload,
};
