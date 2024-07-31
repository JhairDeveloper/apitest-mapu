const campusService = require("../services/campusService.js");

module.exports = {
  createCampus: async (req, res, next) => {
    const newCampus = await campusService.createCampus(req.body);

    return res.json(newCampus);
  },

  getAllCampus: async (req, res) => {
    const { skip = 0, limit = 10, ...where } = req.query;

    const totalCount = await campusService.getCountCampuses(where);
    const results = await campusService.getCampuses(where, skip, limit);

    return res.json({ totalCount, results });
  },

  getCampusById: async (req, res) => {
    const campus = await campusService.getCampusById(req.params.id);

    return res.json(campus);
  },

  updateCampusById: async (req, res) => {
    const updateCampus = await campusService.updateCampusById(
      req.params.id,
      req.body
    );
    return res.json(updateCampus);
  },

  deleteCampusById: async (req, res) => {
    const campusDeleted = await campusService.deleteCampusById(req.params.id);

    return res.json(campusDeleted);
  },
};
