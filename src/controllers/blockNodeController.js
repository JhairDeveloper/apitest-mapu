const blockNodeService = require("../services/blockNodeService");

module.exports = {
  getBlockNode: async (req, res) => {
    const { id } = req.params;

    const results = await blockNodeService.getBlockNodeById(id);

    return res.json(results);
  },

  getAllBlockNodes: async (req, res) => {
    const { skip, limit, ...where } = req.query;

    const totalCount = await blockNodeService.getCountBlockNodes(where);
    const results = await blockNodeService.getBlockNodes(where, skip, limit);

    return res.json({ totalCount, results });
  },

  createBlockNode: async (req, res, next) => {
    const newBlockNode = await blockNodeService.createBlockNode(req.body);

    return res.json(newBlockNode);
  },

  updateBlockNode: async (req, res, next) => {
    const { id } = req.params;

    const updateBlockNode = await blockNodeService.updateBlockNodeById(
      id,
      req.body
    );

    return res.json(updateBlockNode);
  },

  deleteBlockNode: async (req, res, next) => {
    const { id } = req.params;

    const deleteBlockNode = await blockNodeService.deleteBlockNodeById(id);

    return res.json(deleteBlockNode);
  },
};
