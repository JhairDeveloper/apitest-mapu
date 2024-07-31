const bcrypt = require("bcryptjs");

const hashPassword = async (password) => {
  const salt = 10;

  const passwordHashed = await bcrypt.hash(password, salt);

  return passwordHashed;
};

module.exports = { hashPassword };
