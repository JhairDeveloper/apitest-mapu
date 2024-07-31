const { Router } = require("express");
const authController = require("../controllers/authController");
const middlewares = require("../middlewares");
const {
  loginSchema,
  registerUserSchema,
  recoverPasswordSchema,
} = require("../validationSchemas/Auth");

const authRouter = Router();

/**
 * @route POST /login
 * @desc Iniciar sesión
 * @access Public
 */
authRouter.post(
  "/login",
  middlewares.validateRequestBody(loginSchema),
  authController.loginUser
);

/**
 * @route POST /register
 * @desc Registrar nuevo usuario normal
 * @access Public
 */
authRouter.post(
  "/register",
  middlewares.validateRequestBody(registerUserSchema),
  authController.registerUser
);

/**
 * @route POST /generateToken
 * @desc Generar token y enviar por correo para la recuperación de la contraseña
 * @access Public
 */
authRouter.post(
  "/forgot-password",
  middlewares.validateRequestBody(recoverPasswordSchema),
  authController.generatePasswordRecoveryToken
);

/**
 * @route POST /recovery-password
 * @desc Recuperar la contraseña
 * @access Public
 */
authRouter.post("/recovery-password", authController.recoverPassword);

module.exports = authRouter;
