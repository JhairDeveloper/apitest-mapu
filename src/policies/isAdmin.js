const { ADMIN_ROLE_NAME } = require("../constants");
const { validateToken } = require("../helpers/tokenCreation");
const Role = require("../models/Role");

module.exports = async (req, res, next) => {
  try {
    const bearerToken = req.header("Authorization");

    const user = await validateToken(bearerToken);

    if (user.deletedAt) {
      return next({
        status: 403,
        message:
          "Su usuario fue dado de baja, contáctese con el administrador.",
      });
    }

    if (user.bloqued) {
      return next({
        status: 403,
        message: "Usuario bloqueado, contáctese con el administrador",
      });
    }
    req.user = user;

    const adminRole = await Role.findOne({ name: ADMIN_ROLE_NAME });

    if (!adminRole || user?.role.toString() !== adminRole?._id.toString()) {
      return next({
        status: 401,
        message: "El acceso está restringido al administrador",
      });
    }

    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return next({
        status: 401,
        message:
          "Su token de autenticación ha vencido. Vuelva a iniciar sesión",
        code: "jwtExpired",
      });
    }

    next({
      status: 401,
      message: error.message,
    });
  }
};
