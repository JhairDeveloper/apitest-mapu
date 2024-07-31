const Suscription = require("../models/Suscription");
const ValidationError = require("../errors/ValidationError");
const { isValidObjectId } = require("mongoose");

const getSuscriptionById = async (_id) => {
  if (!isValidObjectId(_id)) {
    throw new ValidationError("El id debe ser un ObjectId");
  }

  const suscription = await Suscription.findOne({ _id });
  if (!suscription) {
    throw new ValidationError("No se ha encontrado suscripcion");
  }
  return suscription;
};

const getAllSuscriptions = async (where = {}, skip, limit) => {
  const suscriptions = await Suscription.find(where).skip(skip).limit(limit);
  return suscriptions;
};

const getCountSuscriptions = (where = {}) => {
  return Suscription.count(where);
};

const createSuscription = async (suscription) => {
  const newSuscription = await Suscription.create(suscription);
  return newSuscription;
};

const updateSuscription = async (_id, suscription, idUser) => {
  if (!isValidObjectId(_id)) {
    throw new ValidationError("El id no es de tipo ObjecId");
  }
  if (suscription.userId != idUser) {
    throw new ValidationError("No se ha iniciado sesion con esa cuenta");
  }

  const updateSuscription = await Suscription.updateOne({ _id }, suscription);

  if (!updateSuscription) {
    throw new ValidationError("Suscripcion no fue actualizada");
  }

  return updateSuscription;
};

const deleteSuscription = async (_id, userEmail) => {
  if (!isValidObjectId(_id)) {
    throw new ValidationError("El id no es de tipo ObjectId");
  }
  const suscriptionDB = await getSuscriptionById(_id);

  console.log(suscriptionDB);
  if (userEmail != suscriptionDB.userEmail) {
    throw new ValidationError("No es el propiertario de la cuenta");
  }

  const deleteSuscription = await Suscription.deleteOne({ _id });

  if (!deleteSuscription) {
    throw ValidationError("Suscripcion no encontrada");
  }
  return deleteSuscription;
};

module.exports = {
  getSuscriptionById,
  getAllSuscriptions,
  getCountSuscriptions,
  createSuscription,
  updateSuscription,
  deleteSuscription,
};
