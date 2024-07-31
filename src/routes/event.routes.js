const { Router } = require("express");
const eventController = require("../controllers/eventController");
const middlewares = require("../middlewares");
const {
  createEventSchema,
  updateEventSchema,
} = require("../validationSchemas/Event");
const isAdmin = require("../policies/isAdmin");

const eventRouter = Router();

/**
 * @route POST /
 * @desc Crea un nuevo evento con la información pasada por body
 * @access Admin
 */
eventRouter.post(
  "/",
  isAdmin,
  middlewares.validateRequestBody(createEventSchema),
  eventController.createEvent
);

/**
 * @route GET /
 * @desc Obtener el evento por id
 * @access Public
 */
eventRouter.get("/:id", eventController.getEventById);

/**
 * @route GET /
 * @desc Obtener todos los eventos
 * @access Public
 */
eventRouter.get("/", eventController.getAllEvents);

/**
 * @route PUT /
 * @desc Actualizar un evento con la información pasada por body
 * @access Admin
 */
eventRouter.put(
  "/:id",
  isAdmin,
  middlewares.validateRequestBody(updateEventSchema),
  eventController.updateEvent
);

/**
 * @route DELETE /
 * @desc Eliminar un evento mediante id
 * @access Admin
 */
eventRouter.delete("/:id", isAdmin, eventController.deleteEvent);

module.exports = eventRouter;
