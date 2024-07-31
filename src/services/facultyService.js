const Faculty = require("../models/Faculty");
const ValidationError = require("../errors/ValidationError");
const { isValidObjectId } = require("mongoose");

const createFaculty = async (facultyData) => {
  const faculty = await Faculty.create(facultyData);

  return faculty;
};

const getFaculties = async (where = {}, skip, limit) => {
  const faculties = await Faculty.find(where).skip(skip).limit(limit);

  return faculties;
};

const getFaculty = async (id) => {
  const faculty = await Faculty.findById(id);

  return faculty;
};

const getCountFaculties = async (where = {}) => {
  return await Faculty.count(where);
};

const getFacultyById = async (_id) => {
  if (!isValidObjectId(_id))
    throw new ValidationError("El id debe ser un ObjectId");

  const faculty = await Faculty.findOne({ _id });

  if (!faculty) {
    throw new ValidationError("Facultad no encontrada");
  }

  return faculty;
};

const updateFacultyById = async (_id, newInfo) => {
  let faculty = await getFacultyById(_id);

  faculty = await Faculty.updateOne({ _id }, newInfo);

  return faculty;
};

const deleteFacultyById = async (_id) => {
  if (!isValidObjectId(_id))
    throw new ValidationError("El id debe ser un ObjectId");

  const deletedFaculty = await Faculty.findByIdAndRemove(_id);

  if (!deletedFaculty) throw new ValidationError("Facultad no encontrada");
};

module.exports = {
  createFaculty,
  getFaculties,
  getFaculty,
  getCountFaculties,
  getFacultyById,
  updateFacultyById,
  deleteFacultyById,
};
