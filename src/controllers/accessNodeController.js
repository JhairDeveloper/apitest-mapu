const accessNodeService = require("../services/accessNodeService");

module.exports = {
  getAccessNodeById: async (req, res) => {
    const { id } = req.params;
    const result = await accessNodeService.getAccessNodeById(id);

    res.json(result);
  },

  getAllAccessNode: async (req, res) => {
    let { skip, limit, ...where } = req.query;

    const totalCount = await accessNodeService.getCountAccessNodes(where);
    const results = await accessNodeService.getAccessNodes(where, skip, limit);

    res.json({ totalCount, results });
  },

  createAccessNode: async (req, res) => {
    const newAccessNode = await accessNodeService.createAccessNode(req.body);

    return res.json(newAccessNode);
  },

  updateAccessNode: async (req, res) => {
    const { id } = req.params;

    const updatedAccessNode = await accessNodeService.updateAccessNodeById(
      id,
      req.body
    );
    res.json(updatedAccessNode);
  },

  masiveUpload: async (req, res, next) => {
    const { valid, errorsURL, results } = await accessNodeService.masiveUpload(
      req.file
    );

    if (valid) return res.json({ success: true, results });

    return res.json({ success: false, results: errorsURL });
  },

  deleteAccessNode: async (req, res) => {
    const { id } = req.params;
    const deletedAccessNode = await accessNodeService.deleteAccessNodeById(id);

    res.json(deletedAccessNode);
  },
};
