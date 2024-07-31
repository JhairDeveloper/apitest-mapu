const { Router } = require("express");
const isLoggedIn = require("../policies/isLoggedIn");
const meController = require("../controllers/meController");

const meRouter = Router();

/**
 * @route GET /
 * @desc Obtener perfil personal
 * @access Private User
 */
meRouter.get("/", isLoggedIn, meController.getMyProfile);

/**
 * @route GET /report
 * @desc Obtener todos los reportes realizador por un usuario
 * @access Private isLoggedIn
 */
meRouter.get("/reports", isLoggedIn, meController.getMyReports);

/**
 * @route PUT /
 * @desc Actualizar perfil de usuario
 * @access Private User
 */
meRouter.put("/", isLoggedIn, meController.updateProfile);

module.exports = meRouter;
