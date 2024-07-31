const { Router } = require("express");
const reportController = require("../controllers/reportController.js");
const middlewares = require("../middlewares");
const {
  createReportSchema,
  updateReportSchema,
} = require("../validationSchemas/Report");
const isAdmin = require("../policies/isAdmin.js");
const isLoggedIn = require("../policies/isLoggedIn.js");

const reportRouter = Router();

/**
 * @route GET /
 * @desc Obtiene todos los reportes guardados en BD
 * @access Admin
 */
reportRouter.get("/", isAdmin, reportController.getAllReports);

/**
 * @route GET /:id
 * @desc Obtiene el report por Id
 * @access Admin
 */
reportRouter.get("/:id", isAdmin, reportController.getReportById);

/**
 * @route POST /
 * @desc Crea un reporte con la información pasada por body
 * @access Admin
 */
reportRouter.post(
  "/",
  isLoggedIn,
  middlewares.validateRequestBody(createReportSchema),
  reportController.createReport
);

/**
 * @route PUT /:id
 * @desc Actualiza el reporte modificando el campo revisión
 * @access Admin
 */
reportRouter.put(
  "/:id",
  isAdmin,
  middlewares.validateRequestBody(updateReportSchema),
  reportController.updateReport
);

module.exports = reportRouter;
