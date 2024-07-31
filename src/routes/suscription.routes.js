const { Router } = require("express");
const suscriptionController = require("../controllers/suscriptionController");

const {
  createSuscriptionSchema,
  updateSuscriptionSchema,
} = require("../validationSchemas/Suscription");
const middlewares = require("../middlewares");
const isLoggedIn = require("../policies/isLoggedIn");

const suscriptionRouter = Router();

/**
 * @route POST / create
 * @desc Crear suscripcion
 * @access cliente
 */
suscriptionRouter.post(
  "/",
  isLoggedIn,
  middlewares.validateRequestBody(createSuscriptionSchema),
  suscriptionController.createSuscription
);

/**
 * @route GET / user suscriptions
 * @desc Obtener todas las suscripciones del usuario logueado
 * @access usuario
 */
suscriptionRouter.get(
  "/user",
  isLoggedIn,
  suscriptionController.getUserSuscriptions
);

/**
 * @route GET / user suscriptions
 * @desc Obtener todas las suscripciones del usuario
 * @access usuario
 */
suscriptionRouter.get(
  "/user/:id",
  isLoggedIn,
  suscriptionController.getAnyUserSuscriptions
);

/**
 * @route GET /
 * @desc Obtener suscripcion
 * @access cliente and admin
 */
suscriptionRouter.get(
  "/:id",
  isLoggedIn,
  suscriptionController.getSuscriptionById
);

/**
 * @route GET /
 * @des Obtener el numero de suscipriones junto con cada una de ellas
 * @access cliente and admin
 */
suscriptionRouter.get(
  "/",
  isLoggedIn,
  suscriptionController.getAllSuscriptions
);

/**
 * @route PUT
 * @des Actualizar la suscripcion
 * @acces cliente
 */
suscriptionRouter.put(
  "/:id",
  middlewares.validateRequestBody(updateSuscriptionSchema),
  isLoggedIn,
  suscriptionController.updateSuscription
);

/**
 * @route DELETE /
 * @des Eliminar suscripcion
 * @access cliente
 */
suscriptionRouter.delete(
  "/:id",
  isLoggedIn,
  suscriptionController.deleteSuscription
);

module.exports = suscriptionRouter;
