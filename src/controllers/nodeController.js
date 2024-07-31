const nodeService = require("../services/nodeService.js");

module.exports = {
  getNode: async (req, res) => {
    const id = req.params.id;
    const { adjacencies } = req.query;
    const results = await nodeService.getNodeById(id, adjacencies !== "false");

    return res.json(results);
  },

  getAllNodes: async (req, res) => {
    const {
      // type,
      skip,
      limit,
      populate,
      ...where
    } = req.query;

    const totalCount = await nodeService.getCountNodes(
      where //type
    );
    const results = await nodeService.getNodes(
      where,
      skip,
      limit,
      // type,
      populate === "true"
    );

    return res.json({ totalCount, results });
  },

  getAllCoordinates: async (req, res, next) => {
    const { skip, limit, adjacencies = "false", ...where } = req.query;

    const results = await nodeService.getAllNodesCoordinates(
      req.body,
      skip,
      limit,
      adjacencies === "true"
    );
    const totalCount = await nodeService.getCountNodes(req.body);

    return res.json({ totalCount, results });
  },

  createNode: async (req, res, next) => {
    const newNode = await nodeService.createNodeAdjacencies(req.body);
    return res.json(newNode);
  },

  updateNode: async (req, res, next) => {
    const id = req.params.id;
    const updateNode = await nodeService.updateNodeById(id, req.body);
    return res.json(updateNode);
  },

  deleteNode: async (req, res, next) => {
    const id = req.params.id;
    const deleteNode = await nodeService.deleteNodeById(id);

    return res.json(deleteNode);
  },

  timeBetween: async (req, res) => {
    const origin = req.body.origin;
    const destination = req.body.destination;
    const speed = req.body.speed;
    const time = await nodeService.timeCoordinates(origin, destination, speed);

    return res.json(time);
  },

  getNodeByNomenclature: async (req, res) => {
    const { campus, block, floor, environment } = req.query;

    console.log(req.query);

    const result = await nodeService.getNodeByNomenclature(
      campus,
      block,
      floor,
      environment
    );

    return res.json(result);
  },
};
