const eventService = require("../services/eventService.js");
const NotExist = require("../errors/NotExist");

module.exports = {
  getEventById: async (req, res) => {
    const { id } = req.params;
    const { populate = "true" } = req.query;
    const result = await eventService.getEventById(id, populate !== "false");

    return res.json(result);
  },

  getAllEvents: async (req, res) => {
    const {
      mobile = "false",
      search,
      skip = 0,
      limit = 10,
      populate = "true",
      ...where
    } = req.query;

    const totalCount = await eventService.getCountEvents(mobile, search, where);

    const results = await eventService.getEvents(
      mobile,
      search,
      where,
      skip,
      limit,
      populate !== "false"
    );

    return res.json({ totalCount, results });
  },

  createEvent: async (req, res, next) => {
    const newEvent = await eventService.createEvent(req.body);
    return res.json(newEvent);
  },

  updateEvent: async (req, res, next) => {
    const { id } = req.params;
    const updateBlock = await eventService.updateEventById(id, req.body);
    return res.json(updateBlock);
  },

  deleteEvent: async (req, res, next) => {
    const { id } = req.params;
    const deleteBlock = await eventService.deleteEventById(id);

    return res.json(deleteBlock);
  },
};
