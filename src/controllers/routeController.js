const routeService = require("../services/routeService");

module.exports = {
  findNearestRoute: async (req, res) => {
    let { type, origin, destination, nomenclature } = req.body;

    const { additionalMessage, additionalNode, result } =
      await routeService.findShortestRoute(
        type,
        origin,
        destination,
        nomenclature
      );

    res.json({ additionalMessage, additionalNode, result });
  },
};
