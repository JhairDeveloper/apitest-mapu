const routeNodeService = require("../services/routeNodeService");

module.exports = {
  getRouteNodeById: async (req, res) => {
    const { id } = req.params;
    const result = await routeNodeService.getRouteNodeById(id);

    res.json(result);
  },

  getAllRouteNode: async (req, res) => {
    let { skip, limit, ...where } = req.query;

    const totalCount = await routeNodeService.getCountRouteNodes(where);
    const results = await routeNodeService.getRouteNodes(where, skip, limit);

    res.json({ totalCount, results });
  },

  createRouteNode: async (req, res) => {
    const newRouteNode = await routeNodeService.createRouteNode(req.body);

    return res.json(newRouteNode);
  },

  updateRouteNode: async (req, res) => {
    const { id } = req.params;

    const updatedRouteNode = await routeNodeService.updateRouteNodeById(
      id,
      req.body
    );

    res.json(updatedRouteNode);
  },

  masiveUpload: async (req, res, next) => {
    const { valid, errorsURL, results } = await routeNodeService.masiveUpload(
      req.file
    );

    if (valid) return res.json({ success: true, results });

    // res.set("Content-Disposition", 'attachment; filename="Errores.xlsx"');
    // res.send(buffer);
    return res.json({ success: false, results: errorsURL });
  },

  deleteRouteNode: async (req, res) => {
    const { id } = req.params;

    const deletedRouteNode = await routeNodeService.deleteRouteNodeById(id);

    res.json(deletedRouteNode);
  },
};
