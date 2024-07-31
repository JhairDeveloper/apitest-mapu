const { Router } = require("express");
const interestingNodeController = require("../controllers/interestingNodeController");
const middlewares = require("../middlewares");
const {
  createNodeWithDetailSchema,
  updateNodeWithDetailSchema,
} = require("../validationSchemas/NodeWithDetail");
const isAdmin = require("../policies/isAdmin");
const { upload } = require("../configs/multerConfig");

const interestingNodeRouter = Router();

/**
 * @route POST /
 * @desc Crea un nuevo nodo de interes con la información pasada por body
 * @access Admin
 */
interestingNodeRouter.post(
  "/",
  isAdmin,
  middlewares.validateRequestBody(createNodeWithDetailSchema),
  interestingNodeController.createInterestingNode
);

/**
 * @route GET /
 * @desc Obtener todos los nodos
 * @access Public
 */
interestingNodeRouter.get(
  "/",
  interestingNodeController.getAllInterestingNodes
);

/**
 * @route GET /:id
 * @desc Obtener el nodo por id
 * @access Public
 */
interestingNodeRouter.get("/:id", interestingNodeController.getInterestingNode);

/**
 * @route PUT /
 * @desc Actualizar un nodo con la información pasada por body
 * @access Admin
 */
interestingNodeRouter.put(
  "/:id",
  isAdmin,
  middlewares.validateRequestBody(updateNodeWithDetailSchema),
  interestingNodeController.updateInterestingNode
);

/**
 * @route DELETE /
 * @desc Eliminar un nodo por id
 * @access Admin
 */
interestingNodeRouter.delete(
  "/:id",
  isAdmin,
  interestingNodeController.deleteInterestingNode
);

interestingNodeRouter.post(
  "/upload",
  isAdmin,
  upload.single("file"),
  interestingNodeController.masiveUpload
);

module.exports = interestingNodeRouter;
