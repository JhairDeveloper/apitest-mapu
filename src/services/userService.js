const { isValidObjectId } = require("mongoose");
const ValidationError = require("../errors/ValidationError");
const { hashPassword } = require("../helpers/hashPassword");
const User = require("../models/User");

const getAllUser = async (where = {}, skip = 10, limit = 10) => {
  where.deletedAt = null;
  const allUsers = await User.find(where)
    .skip(skip)
    .limit(limit)
    .populate("role");

  return allUsers;
};

const getCountUser = async (where = {}) => {
  where.deletedAt = null;
  return await User.count(where);
};

const getUserById = async (_id) => {
  if (!isValidObjectId(_id))
    throw new ValidationError("El id debe ser un ObjectId");

  const user = await User.findOne({ _id }).populate("role");

  if (!user) throw new ValidationError("Usuario no encontrado");

  return user;
};

const createUser = async ({ password, ...newUser }) => {
  const userExists = await User.findOne({ email: newUser.email });

  const hashedPassword = await hashPassword(password);
  newUser.password = hashedPassword;

  if (userExists) {
    throw new ValidationError(`El email ${newUser.email} ya está registrado`);
  }

  const user = await User.create({
    ...newUser,
    settings: {
      nofitication: true,
      spam: true,
    },
  });
  return user;
};

const updateUser = async (_id, newInfo) => {
  let user = await getUserById(_id);

  if (newInfo.password) {
    newInfo.password = await hashPassword(newInfo.password);
  }

  user = await User.findOneAndUpdate({ _id }, newInfo, { new: true });

  return user;
};

const deleteUser = async (_id) => {
  if (!isValidObjectId(_id))
    throw new ValidationError("El id debe ser un ObjectId");

  const toDelete = await updateUser(_id, { email: null });

  const deleted = await toDelete.softDelete();

  return deleted;
};

module.exports = {
  getAllUser,
  getUserById,
  updateUser,
  deleteUser,
  getCountUser,
  createUser,
};
