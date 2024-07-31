const categoryController = require("../controllers/categoryController");
const { Router } = require("express");
const middlewares = require("../middlewares");
const {
  createCategorySchema,
  updateCategorySchema,
} = require("../validationSchemas/Category");
const isAdmin = require("../policies/isAdmin");

const categoryRouter = Router();

/**
 * @route GET /
 * @desc Devuelve todas las categorias registradas en la BDD
 * @access Public
 */
categoryRouter.get("/", categoryController.getAllCategories);

/**
 * @route GET /
 * @desc Devuelve una categoria buscada por Id
 * @access Public
 */
categoryRouter.get("/:id", categoryController.getCategoryById);

/**
 * @route POST /
 * @desc Crea una categoria con la información pasada por body
 * @access Admin
 */
categoryRouter.post(
  "/",
  isAdmin,
  middlewares.validateRequestBody(createCategorySchema),
  categoryController.createCategory
);

/**
 * @route PUT /
 * @desc Actualiza una categoria buscándola por Id
 * @access Admin
 */
categoryRouter.put(
  "/:id",
  isAdmin,
  middlewares.validateRequestBody(updateCategorySchema),
  categoryController.updateCategory
);

/**
 * @route DELETE /
 * @desc Elimina una categoria buscándola por Id
 * @access Admin
 */
categoryRouter.delete("/:id", isAdmin, categoryController.deleteCategoryById);

module.exports = categoryRouter;
