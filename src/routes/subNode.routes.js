const { Router } = require("express");
const subNodeController = require("../controllers/subNodeController.js");
const middlewares = require("../middlewares");
const {
  createSubNodeSchema,
  updateSubNodeSchema,
} = require("../validationSchemas/SubNode.js");
const isAdmin = require("../policies/isAdmin.js");
const { upload } = require("../configs/multerConfig.js");
const subNodeRouter = Router();

subNodeRouter.post(
  "/",
  isAdmin,
  middlewares.validateRequestBody(createSubNodeSchema),
  subNodeController.createSubNode
);

subNodeRouter.post(
  "/upload",
  isAdmin,
  upload.single("file"),
  subNodeController.masiveUpload
);

subNodeRouter.get("/", subNodeController.getAllSubNodes);

subNodeRouter.get("/:id", subNodeController.getSubNodeById);

subNodeRouter.put(
  "/:id",
  isAdmin,
  middlewares.validateRequestBody(updateSubNodeSchema),
  subNodeController.updateSubNode
);

subNodeRouter.delete("/:id", subNodeController.deleteSubNode);

module.exports = subNodeRouter;
