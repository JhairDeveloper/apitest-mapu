const { Router } = require("express");
const sectorController = require("../controllers/sectorController");
// const middlewares = require("../middlewares");
const isAdmin = require("../policies/isAdmin");
// const schemas = require("../validationSchemas/Sector");

const sectorRouter = Router();

/**
 * @route GET /
 * @desc Obtener todos las sectores
 * @access Private Admin
 */
sectorRouter.get("/", sectorController.getAllSectors);

/**
 * @route GET /:id
 * @desc Obtener detalle de un sector por id
 * @access Public
 */
sectorRouter.get("/:id", sectorController.getSectorById);

/**
 * @route POST /
 * @desc Crea una nueva facultad con la información pasada por body
 * @access Admin
 */
sectorRouter.post(
  "/",
  isAdmin,
  // middlewares.validateRequestBody(schemas.createSectorSchema),
  sectorController.createSector
);

/**
 * @route PUT /:id
 * @desc Actualizar un sector existente por id
 * @access Private Admin
 */
sectorRouter.put(
  "/:id",
  isAdmin,
  // middlewares.validateRequestBody(schemas.updateSectorSchema),
  sectorController.updateSector
);

/**
 * @route DELETE /:id
 * @desc Eliminar sector por id
 * @access Private Admin
 */
sectorRouter.delete("/:id", isAdmin, sectorController.deleteSectorById);

module.exports = sectorRouter;
