const { Router } = require("express");
const imageController = require("../controllers/imageController");
const { upload } = require("../configs/multerConfig");

const blockRouter = Router();

/**
 * @route POST /
 * @desc Subir imagen a s3
 * @access Admin
 */
blockRouter.post("/", upload.single("file"), imageController.uploadImage);

module.exports = blockRouter;
