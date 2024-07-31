const User = require("../models/User");

//TODO: modified role
const createUser = async (userData) => {
  const userCreated = await User.create(userData);
  return userCreated;
};

module.exports = { createUser };
