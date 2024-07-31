const { Router } = require("express");
const dashboardController = require("../controllers/dashboardController");
const isAdmin = require("../policies/isAdmin");

const dashboardRouter = Router();

/**
 * @route GET /count
 * @desc Obtener todos los conteos de los documentos creados
 * @access Private Admin
 */
dashboardRouter.get("/count", isAdmin, dashboardController.getCounts);

module.exports = dashboardRouter;
