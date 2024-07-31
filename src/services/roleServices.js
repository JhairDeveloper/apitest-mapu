const { isValidObjectId } = require("mongoose");
const Role = require("../models/Role");
const ValidationError = require("../errors/ValidationError");

const getRoleById = async (_id) => {
  if (!isValidObjectId(_id))
    throw new ValidationError("El id debe ser un ObjectId");

  const role = await Role.findOne({ _id });

  if (!role) throw new ValidationError("Rol no encontrado");

  return role;
};

const getAllRoles = async (where = {}, skip, limit) => {
  const allRoles = await Role.find(where).skip(skip).limit(limit);

  return allRoles;
};

const getCountRoles = async (where = {}) => {
  return await Role.count(where);
};

const createRole = async (role) => {
  const roleCreated = await Role.create(role);

  return roleCreated;
};

const updateRole = async (_id, newInfo) => {
  let role = await getRoleById(_id);

  role = await Role.updateOne({ _id }, newInfo);

  return role;
};

const deleteRole = async (_id) => {
  if (!isValidObjectId(_id))
    throw new ValidationError("El id debe ser un objectId");

  const deletedRole = await Role.findByIdAndRemove(_id);

  if (!deletedRole) throw new ValidationError("Rol no encontrado");
};

module.exports = {
  getAllRoles,
  getCountRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
};
