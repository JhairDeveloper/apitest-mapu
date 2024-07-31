const adjacencyService = require("../services/adjacencyService");
const BadRequestError = require("../errors/BadRequestError");

module.exports = {
  getAdjacenciesByNode: async (req, res) => {
    const { node } = req.params;
    const results = await adjacencyService.getNodeAdjacencies(node);

    res.json({ totalCount: results.length, results });
  },

  getAllAdjacencies: async (req, res) => {
    let { skip, limit, populate, ...where } = req.query;

    const totalCount = await adjacencyService.getAllAdjacenciesCount(where);
    const results = await adjacencyService.getAllAdjacencies(
      where,
      populate === "true"
    );

    res.json({ totalCount, results });
  },

  createAdjacency: async (req, res) => {
    const { origin, destination, nodes } = req.body;

    if (!nodes?.length && (!origin || !destination)) {
      throw new BadRequestError(
        "Cuando no se envía el campo 'nodes', los campos 'origin' y 'destination' son requeridos"
      );
    }

    if (nodes?.length && (origin || destination)) {
      throw new BadRequestError(
        "Cuando se envía el campo 'nodes', el campo 'origin' y 'destination' deben ir a null o no enviarse"
      );
    }

    let adjacencies = [];

    if (nodes?.length) {
      adjacencies = await adjacencyService.createAdjacencies(nodes);
    } else {
      const newAdjacency = await adjacencyService.createAdjacency(
        origin,
        destination
      );

      adjacencies.push(newAdjacency);
    }

    return res.json(adjacencies);
  },

  deleteAdjacencies: async (req, res) => {
    const { adjacencies } = req.body;

    const deletedAdjacencies = await adjacencyService.deleteAdjacencies(
      adjacencies
    );

    res.json(deletedAdjacencies);
  },

  masiveUpload: async (req, res, next) => {
    const { valid, errorsURL, results } = await adjacencyService.masiveUpload(
      req.file
    );

    if (valid) return res.json({ success: true, results });

    return res.json({ success: false, results: errorsURL });
  },
};
