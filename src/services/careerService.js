const Career = require("../models/Career");
const ValidationError = require("../errors/ValidationError");
const { isValidObjectId } = require("mongoose");

const getCareers = async (where = {}, skip, limit) => {
  const careers = await Career.find(where)
    .skip(skip)
    .limit(limit)
    .populate("faculty");

  return careers;
};

const getCountCareers = async (where = {}) => {
  const countCareers = await Career.count(where);

  return countCareers;
};

const getCareerById = async (id) => {
  if (!isValidObjectId(id)) {
    throw new ValidationError("El dato enviado debe ser un ObjectId");
  }

  const career = await Career.findById(id).populate("faculty");

  if (!career) {
    throw new ValidationError("Carrera no encontrada");
  }

  return career;
};

const createCareer = async (careerData) => {
  const newCareer = await Career.create(careerData);

  return newCareer;
};

const updateCareer = async (id, careerData) => {
  if (!isValidObjectId(id)) {
    throw new ValidationError("El dato enviado debe ser un ObjectId");
  }

  const updateCareer = await Career.findByIdAndUpdate(id, careerData, {
    new: true,
  });

  if (!updateCareer) {
    throw new ValidationError("Carrera no encontrada");
  }

  return updateCareer;
};

const deleteCareerById = async (id) => {
  if (!isValidObjectId(id)) {
    throw new ValidationError("El dato enviado debe ser un ObjectId");
  }

  const deleteCareer = await Career.findByIdAndDelete(id);

  if (!deleteCareer) {
    throw new ValidationError("Carrera no encontrada");
  }

  return deleteCareer;
};

module.exports = {
  getCareers,
  getCountCareers,
  getCareerById,
  createCareer,
  updateCareer,
  deleteCareerById,
};
