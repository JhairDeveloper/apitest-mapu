const { Router } = require("express");
const userController = require("../controllers/userController");
const {
  editUserSchema,
  createUserSchema,
} = require("../validationSchemas/user");
const middlewares = require("../middlewares");
const isAdmin = require("../policies/isAdmin");

const userRouter = Router();

/**
 * @route GET /
 * @desc Obtener todos las usuarios
 * @access Private Admin
 */
userRouter.get("/", isAdmin, userController.getAllUsers);

/**
 * @route GET /:id
 * @desc Obtener usuario por id
 * @access Private Admin
 */
userRouter.get("/:id", isAdmin, userController.getUserById);

/**
 * @route POST /
 * @desc Crear usuario
 * @access Private Admin
 */
userRouter.post(
  "/",
  isAdmin,
  middlewares.validateRequestBody(createUserSchema),
  userController.createUser
);

/**
 * @route PUT /:id
 * @desc Actualizar usuario por id
 * @access Private Admin
 */
userRouter.put(
  "/:id",
  isAdmin,
  middlewares.validateRequestBody(editUserSchema),
  userController.updateUser
);

// No se podrá borrar usuarios, solo bloquearlos/retringirlos
/**
 * @route DELETE /:id
 * @desc Bloquear usuario por id
 * @access Private Admin
 */
userRouter.delete("/:id", isAdmin, userController.deleteUser);

module.exports = userRouter;
