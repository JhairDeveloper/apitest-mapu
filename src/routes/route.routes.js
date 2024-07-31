const { Router } = require("express");
const routeController = require("../controllers/routeController");
const middlewares = require("../middlewares");
const { getNearestRoute } = require("../validationSchemas/Route");

const routeRouter = Router();

/**
 * @route POST /
 * @desc Encuentra la ruta más corta de un origen hacia un destino
 * @route Admin
 */
routeRouter.post(
  "/",
  middlewares.validateRequestBody(getNearestRoute),
  routeController.findNearestRoute
);

module.exports = routeRouter;
