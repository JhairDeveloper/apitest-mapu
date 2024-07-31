const ValidationError = require("../errors/ValidationError");
const Campus = require("../models/Campus");
const { isValidObjectId } = require("mongoose");

const createCampus = async (campusData) => {
  const campus = await Campus.create(campusData);

  return campus;
};

const getCampuses = async (where = {}, skip, limit) => {
  const campuses = await Campus.find(where).skip(skip).limit(limit);

  return campuses;
};
const getCampusByName = async (name) => {
  const campus = await Campus.findOne({ name });
  return campus;
};

const getCampusById = async (id) => {
  if (!isValidObjectId(id)) {
    throw new ValidationError("El dato enviado debe ser un ObjectId");
  }
  const campus = await Campus.findById(id).exec();

  if (!campus) {
    throw new ValidationError("Campus no encontrado");
  }
  return campus;
};

const getCountCampuses = async (where = {}) => {
  const numberCampuses = await Campus.count(where);

  return numberCampuses;
};

const updateCampusById = async (id, campusData) => {
  const updateCampus = await Campus.findByIdAndUpdate(id, campusData, {
    new: true,
  });

  return updateCampus;
};

const deleteCampusById = async (id) => {
  if (!isValidObjectId(id))
    throw new ValidationError("El id debe ser un objectId");

  const campusDeleted = await Campus.findByIdAndDelete(id);

  return campusDeleted;
};

const deleteCampus = async (where = {}) => {
  if (Object.keys(where).lenght <= 0)
    throw new ValidationError("Proporcione un criterio de filtrado");

  const numberCampusesDeleted = await Campus.deleteOne(where);

  return numberCampusesDeleted;
};

module.exports = {
  createCampus,
  getCampuses,
  getCampusById,
  getCountCampuses,
  updateCampusById,
  deleteCampusById,
  deleteCampus,
  getCampusByName,
};
