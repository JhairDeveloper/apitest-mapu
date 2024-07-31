const { Router } = require("express");
const adjacencyController = require("../controllers/adjacencyController");
const middlewares = require("../middlewares");
const {
  createAdjacencySchema,
  deleteAdjacenciesSchema,
} = require("../validationSchemas/Adjacency");
const isAdmin = require("../policies/isAdmin");
const { upload } = require("../configs/multerConfig");

const adjacencyRouter = Router();

/**
 * @route POST /
 * @desc Crear nueva adjacencies
 * @access Private Admin
 */
adjacencyRouter.post(
  "/",
  isAdmin,
  middlewares.validateRequestBody(createAdjacencySchema),
  adjacencyController.createAdjacency
);

/**
 * @route POST /upload
 * @access Admin
 */
adjacencyRouter.post(
  "/upload",
  isAdmin,
  upload.single("file"),
  adjacencyController.masiveUpload
);

/**
 * @route GET /
 * @desc Obtener todas las adjacencies
 * @access Public
 */
adjacencyRouter.get("/", adjacencyController.getAllAdjacencies);

/**
 * @route GET /
 * @desc Obtener todas las adyacencias de un nodo
 * @access Public
 */
adjacencyRouter.get("/:node", adjacencyController.getAdjacenciesByNode);

/**
 * @route DELETE /
 * @desc Eliminar las adyacencias
 * @access Private Admin
 */
adjacencyRouter.delete(
  "/",
  isAdmin,
  middlewares.validateRequestBody(deleteAdjacenciesSchema),
  adjacencyController.deleteAdjacencies
);

module.exports = adjacencyRouter;
