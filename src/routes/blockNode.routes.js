const { Router } = require("express");
const blockNodeController = require("../controllers/blockNodeController");
const middlewares = require("../middlewares");
const {
  createNodeWithDetailSchema,
  updateNodeWithDetailSchema,
} = require("../validationSchemas/NodeWithDetail");
const isAdmin = require("../policies/isAdmin");

const blockNodeRouter = Router();

/**
 * @route POST /
 * @desc Crea un nuevo nodo de interes con la información pasada por body
 * @access Admin
 */
// blockNodeRouter.post(
//   "/",
//   middlewares.validateRequestBody(createNodeWithDetailSchema),
//   blockNodeController.createBlockNode
// );

/**
 * @route GET /
 * @desc Obtener todos los nodos
 * @access Public
 */
blockNodeRouter.get("/", blockNodeController.getAllBlockNodes);

/**
 * @route GET /:id
 * @desc Obtener el nodo por id
 * @access Public
 */
blockNodeRouter.get("/:id", blockNodeController.getBlockNode);

/**
 * @route PUT /
 * @desc Actualizar un nodo con la información pasada por body
 * @access Admin
 */
blockNodeRouter.put(
  "/:id",
  isAdmin,
  middlewares.validateRequestBody(updateNodeWithDetailSchema),
  blockNodeController.updateBlockNode
);

/**
 * @route DELETE /
 * @desc Eliminar un nodo por id
 * @access Admin
 */
// blockNodeRouter.delete("/:id", blockNodeController.deleteBlockNode);

module.exports = blockNodeRouter;
