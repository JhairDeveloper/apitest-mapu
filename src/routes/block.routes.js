const { Router } = require("express");
const blockController = require("../controllers/blockController");
const middlewares = require("../middlewares");
const {
  createBlockSchema,
  updateBlockSchema,
} = require("../validationSchemas/Block");
const isAdmin = require("../policies/isAdmin");
const { upload } = require("../configs/multerConfig");

const blockRouter = Router();

/**
 * @route POST /
 * @desc Crea un nuevo bloque con la información pasada por body
 * @access Admin
 */
blockRouter.post(
  "/",
  isAdmin,
  middlewares.validateRequestBody(createBlockSchema),
  blockController.createBlock
);

/**
 * @route POST /upload
 * @access Admin
 */
blockRouter.post(
  "/upload",
  isAdmin,
  upload.single("file"),
  blockController.masiveUpload
);

/**
 * @route GET /
 * @desc Obtener todas los bloques
 * @access Public
 */
blockRouter.get("/", blockController.getAllBlocks);

/**
 * @route GET /
 * @desc Obtener el bloque por el numero
 * @access Public
 */
blockRouter.get("/:id", blockController.getBlock);

/**
 * @route PUT /
 * @desc Actualizar un bloque con la información pasada por body
 * @access Admin
 */
blockRouter.put(
  "/:id",
  isAdmin,
  middlewares.validateRequestBody(updateBlockSchema),
  blockController.updateBlock
);

/**
 * @route DELETE /
 * @desc Eliminar un bloque mediante su numero de bloque
 * @access Admin
 */
blockRouter.delete("/:id", isAdmin, blockController.deleteBlock);

module.exports = blockRouter;
