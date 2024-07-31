const blockServices = require("../services/blockService.js");

module.exports = {
  getBlock: async (req, res) => {
    const { id } = req.params;
    const result = await blockServices.getBlockById(id);

    return res.json(result);
  },

  getAllBlocks: async (req, res) => {
    const { skip, limit, populate, ...where } = req.query;

    const totalCount = await blockServices.getCountBlocks(where);
    const results = await blockServices.getBlocks(
      where,
      skip,
      limit,
      populate !== "false"
    );

    return res.json({ totalCount, results });
  },

  createBlock: async (req, res, next) => {
    const newBlock = await blockServices.createBlock(req.body);

    return res.json(newBlock);
  },

  updateBlock: async (req, res, next) => {
    const { id } = req.params;

    const updateBlock = await blockServices.updateBlockById(id, req.body);

    return res.json(updateBlock);
  },

  masiveUpload: async (req, res, next) => {
    const { valid, errorsURL, results } = await blockServices.masiveUpload(
      req.file
    );

    if (valid) return res.json({ success: true, results });

    // res.set("Content-Disposition", 'attachment; filename="Errores.xlsx"');
    // res.send(buffer);
    return res.json({ success: false, results: errorsURL });
  },

  deleteBlock: async (req, res, next) => {
    const { id } = req.params;

    const deleteBlock = await blockServices.deleteBlockById(id);

    return res.json(deleteBlock);
  },
};
