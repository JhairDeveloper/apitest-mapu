const { Router } = require("express");
const {
  createCareerSchema,
  updateCareerSchema,
} = require("../validationSchemas/Career");
const careerController = require("../controllers/careerController");
const middlewares = require("../middlewares");
const isAdmin = require("../policies/isAdmin");

const careerRouter = Router();

/**
 * @route GET /
 * @desc Devuelve todas las carreras registradas en la BDD
 * @access Public
 */
careerRouter.get("/", careerController.getAllCareers);

/**
 * @route GET /
 * @desc Devuelve una carrera buscada por Id
 * @access Public
 */
careerRouter.get("/:id", careerController.getCareerById);

/**
 * @route POST /
 * @desc Crea una carrera con la información pasada por body
 * @access Admin
 */
careerRouter.post(
  "/",
  isAdmin,
  middlewares.validateRequestBody(createCareerSchema),
  careerController.createCareer
);

/**
 * @route PUT /
 * @desc Actualiza una carrera buscándola por Id
 * @access Admin
 */
careerRouter.put(
  "/:id",
  isAdmin,
  middlewares.validateRequestBody(updateCareerSchema),
  careerController.updateCareer
);

/**
 * @route DELETE /
 * @desc Elimina una carrera buscándola por Id
 * @access Admin
 */
careerRouter.delete("/:id", isAdmin, careerController.deleteCareerById);

module.exports = careerRouter;
