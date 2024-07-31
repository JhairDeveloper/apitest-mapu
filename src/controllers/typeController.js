const typesService = require("../services/typeService.js");

module.exports = {
  createType: async (req, res, next) => {
    const newType = await typesService.createType(req.body);
    return res.json(newType);
  },

  getAllTypes: async (req, res) => {
    const { skip = 0, limit = 10 } = req.query;

    const totalCount = await typesService.getCountTypes(req.query);
    const results = await typesService.getTypes(req.query, skip, limit);

    return res.json({ totalCount, results });
  },

  getTypeById: async (req, res) => {
    const type = await typesService.getTypeById(req.params.id);
    return res.json(type);
  },

  updateType: async (req, res) => {
    const { id } = req.params;
    const updateType = await typesService.updateTypeById(id, req.body);
    return res.json(updateType);
  },

  deleteType: async (req, res) => {
    const deletedType = await typesService.deleteTypeById(req.params.id);
    return res.json(deletedType);
  },
};
