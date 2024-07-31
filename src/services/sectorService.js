const Sector = require("../models/Sector");
const ValidationError = require("../errors/ValidationError");
const { isValidObjectId } = require("mongoose");

const createSector = async (sectorData) => {
  const sector = await Sector.create(sectorData);

  return sector;
};

const getSectors = async (where = {}, skip, limit) => {
  const sectors = await Sector.find(where).skip(skip).limit(limit);

  return sectors;
};

const getSector = async (id) => {
  const sector = await Sector.findById(id);

  return sector;
};

const getCountSectors = async (where = {}) => {
  return await Sector.count(where);
};

const getSectorById = async (_id) => {
  if (!isValidObjectId(_id))
    throw new ValidationError("El id debe ser un ObjectId");

  const sector = await Sector.findOne({ _id });

  if (!sector) {
    throw new ValidationError("Sector no encontrada");
  }

  return sector;
};

const updateSectorById = async (_id, newInfo) => {
  let sector = await getSectorById(_id);

  sector = await Sector.updateOne({ _id }, newInfo);

  return sector;
};

const deleteSectorById = async (_id) => {
  if (!isValidObjectId(_id))
    throw new ValidationError("El id debe ser un ObjectId");

  const deletedSector = await Sector.findByIdAndRemove(_id);

  if (!deletedSector) throw new ValidationError("Sector no encontrada");

  return deletedSector;
};

module.exports = {
  createSector,
  getSectors,
  getSector,
  getCountSectors,
  getSectorById,
  updateSectorById,
  deleteSectorById,
};
