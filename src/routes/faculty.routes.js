const { Router } = require("express");
const facultyController = require("../controllers/facultyController");
const middlewares = require("../middlewares");
const schemas = require("../validationSchemas/Faculty");
const isAdmin = require("../policies/isAdmin");

const facultyRouter = Router();

/**
 * @route GET /
 * @desc Obtener todas las facultades
 * @access Public
 */
facultyRouter.get("/", facultyController.getAllFaculties);

/**
 * @route GET /:id
 * @desc Obtener detalle de una facultad por id
 * @access Public
 */
facultyRouter.get("/:id", facultyController.getFacultyById);

/**
 * @route POST /
 * @desc Crea una nueva facultad con la información pasada por body
 * @access Admin
 */
facultyRouter.post(
  "/",
  isAdmin,
  middlewares.validateRequestBody(schemas.createFacultySchema),
  facultyController.createFaculty
);

/**
 * @route PUT /:id
 * @desc Actualizar una facultad existente por id
 * @access Admin
 */
facultyRouter.put(
  "/:id",
  isAdmin,
  middlewares.validateRequestBody(schemas.updateFacultySchema),
  facultyController.updateFaculty
);

/**
 * @route DELETE /:id
 * @desc Eliminar facultad por id
 * @access Admin
 */
facultyRouter.delete("/:id", isAdmin, facultyController.deleteFacultyById);

module.exports = facultyRouter;
