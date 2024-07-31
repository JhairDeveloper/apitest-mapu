const { Router } = require("express");
const routeNodeController = require("../controllers/routeNodeController");
const middlewares = require("../middlewares");
const {
  createNodeSchema,
  updateNodeSchema,
} = require("../validationSchemas/RouteNode");
const isAdmin = require("../policies/isAdmin");
const { upload } = require("../configs/multerConfig");

const routeNodeRouter = Router();

/**
 * @route POST /
 * @desc Crea un nuevo nodo de interes con la información pasada por body
 * @route Admin
 */
routeNodeRouter.post(
  "/",
  isAdmin,
  middlewares.validateRequestBody(createNodeSchema),
  routeNodeController.createRouteNode
);

/**
 * @route POST /upload
 * @access Admin
 */
routeNodeRouter.post(
  "/upload",
  isAdmin,
  upload.single("file"),
  routeNodeController.masiveUpload
);

/**
 * @route GET /
 * @desc Obtener todos los nodos
 * @route Public
 */
routeNodeRouter.get("/", routeNodeController.getAllRouteNode);

/**
 * @route GET /:id
 * @desc Obtener el nodo por id
 * @route Public
 */
routeNodeRouter.get("/:id", routeNodeController.getRouteNodeById);

/**
 * @route PUT /
 * @desc Actualizar un nodo con la información pasada por body
 * @route Admin
 */
routeNodeRouter.put(
  "/:id",
  isAdmin,
  middlewares.validateRequestBody(updateNodeSchema),
  routeNodeController.updateRouteNode
);

/**
 * @route DELETE /
 * @desc Eliminar un nodo por id
 * @route Admin
 */
routeNodeRouter.delete("/:id", isAdmin, routeNodeController.deleteRouteNode);

module.exports = routeNodeRouter;
