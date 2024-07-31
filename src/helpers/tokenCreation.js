const jwt = require("jsonwebtoken");
const ValidationError = require("../errors/ValidationError");
const User = require("../models/User");
const { JWT_SECRET } = process.env;

const generateNewToken = (payload, expiresIn = "7d") => {
  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      JWT_SECRET,
      {
        expiresIn,
      },
      (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token);
        }
      }
    );
  });
};

const validateToken = async (bearerToken) => {
  const [_, token] = bearerToken?.split(" ") || [];

  if (!token) {
    throw new ValidationError("No se ha encontrado un token de validación");
  }

  const decoded = jwt.verify(token, JWT_SECRET);
  const _id = decoded.id;
  // console.log(`DECODED ${decoded.id}`);
  const user = await User.findOne({ _id });

  if (!user) {
    throw new ValidationError("Token no válido");
  }

  return user;
};

module.exports = {
  generateNewToken,
  validateToken,
};
