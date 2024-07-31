const careerService = require("../services/careerService");

module.exports = {
  getAllCareers: async(req, res) => {
    const { skip = 0, limit = 10, ...where } = req.query;

    const totalCount = await careerService.getCountCareers(where);
    const results = await careerService.getCareers(where, skip, limit);

    return res.json({ totalCount, results });
  },

  getCareerById: async(req, res) => {
    const career = await careerService.getCareerById(req.params.id);

    return res.json(career);
  },

  createCareer: async(req, res) => {
    const newCareer = await careerService.createCareer(req.body);

    return res.json(newCareer);
  },

  updateCareer: async(req, res) => {
    const updateCareer = await careerService.updateCareer(req.params.id, req.body);

    return res.json(updateCareer);
  },

  deleteCareerById: async(req, res) => {
    const deleteCareer = await careerService.deleteCareerById(req.params.id);

    return res.json(deleteCareer);
  }
};