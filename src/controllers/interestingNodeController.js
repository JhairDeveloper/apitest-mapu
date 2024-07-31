const interestingnodeService = require("../services/interestingNodeService.js");

module.exports = {
  getInterestingNode: async (req, res) => {
    const { id } = req.params;

    const results = await interestingnodeService.getInterestingNodeById(id);

    return res.json(results);
  },

  getAllInterestingNodes: async (req, res) => {
    const { skip, limit, search, ...where } = req.query;

    const totalCount = await interestingnodeService.getCountInterestingNodes(
      where,
      search
    );
    const results = await interestingnodeService.getInterestingNodes(
      where,
      skip,
      limit,
      search
    );

    return res.json({ totalCount, results });
  },

  createInterestingNode: async (req, res, next) => {
    const newInterestingNode =
      await interestingnodeService.createInterestingNode(req.body);

    return res.json(newInterestingNode);
  },

  updateInterestingNode: async (req, res, next) => {
    const { id } = req.params;

    const updateInterestingNode =
      await interestingnodeService.updateInterestingNodeById(id, req.body);

    return res.json(updateInterestingNode);
  },

  deleteInterestingNode: async (req, res, next) => {
    const { id } = req.params;

    const deleteInterestingNode =
      await interestingnodeService.deleteInterestingNodeById(id);

    return res.json(deleteInterestingNode);
  },

  masiveUpload: async (req, res, next) => {
    const { valid, errorsURL, results } = await interestingnodeService.masiveUpload(
      req.file
    );

    if (valid) return res.json({ success: true, results });

    return res.json({ success: false, results: errorsURL });
  },
};
