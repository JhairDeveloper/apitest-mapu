const Campus = require("../models/Campus");
const Block = require("../models/Block");
const Node = require("../models/Node");
const Detail = require("../models/Detail");
const Adjacency = require("../models/Adjacency");
const ValidationError = require("../errors/ValidationError");
const NotExist = require("../errors/NotExist");
const detailService = require("../services/detailService");
// const adjacencyService = require("../services/adjacencyService");
const { isValidObjectId } = require("mongoose");
const {
  timeBetweenCoordinates,
  getDistanceBetweenCoordinates,
  generateLocationString,
} = require("../helpers/index");
const SubNode = require("../models/SubNode");
const { ROUTE_NODO_TYPE, COLORS_DICTIONARY } = require("../constants");

const populateDetail = async (node) => {
  const formated = node.toJSON();

  if (node.detail)
    formated.detail = await detailService.getDetailById(node.detail);

  return formated;
};

const nodeAlreadyExists = async (latitude, longitude) => {
  const sameCoor = await Node.find({
    latitude,
    longitude,
    deletedAt: null,
  });

  if (sameCoor.length)
    throw new ValidationError(
      "Ya existe un nodo con la misma latitud y longitud"
    );
};

const createNode = async (nodeData = {}) => {
  // adjacency debe ser un array de ids de nodos (de cualquier tipo)
  const { latitude, longitude, adjacency = [], ...restData } = nodeData;
  const createdAdjacencies = [];
  await nodeAlreadyExists(latitude, longitude);

  const node = await Node.create({ latitude, longitude, ...restData });

  if (adjacency.length > 0) {
    for (let i = 0; i < adjacency.length; i++) {
      // Busco el documento del nodo creado
      let nodeAdjacency = await Node.findOne({
        latitude: adjacency[i].latitude,
        longitude: adjacency[i].longitude,
        deletedAt: null,
      });

      // Hallo la distancia entre los dos nodos
      const weight = getDistanceBetweenCoordinates(
        latitude,
        longitude,
        nodeAdjacency.latitude,
        nodeAdjacency.longitude
      );

      const adjacency = await Adjacency.create({
        origin: node.id,
        destination: nodeAdjacency.id,
        weight,
      });

      createdAdjacencies.push(adjacency);
    }
  }

  node.adjacency = createdAdjacencies;

  return node;
};

const createNodeWithDetail = async (newNode) => {
  const { detail = {}, ...node } = newNode;

  let createdNode = await createNode(node);
  const detailDB = await detailService.createDetail(detail);

  createdNode.detail = detailDB._id;
  await updateNodeById(createdNode._id, { detail: detailDB._id });

  return createdNode;
};

const getNodes = async (where = {}, skip, limit, populate = true) => {
  let nodes = [];

  if (skip || limit)
    nodes = populate
      ? await Node.find(where)
        .skip(skip ?? 0)
        .limit(limit ?? 10)
        .populate("type")
        .populate("campus")
        .populate("category")
        .sort({ createdAt: -1 })
      : await Node.find(where)
        .skip(skip ?? 0)
        .limit(limit ?? 10)
        .sort({ createdAt: -1 });
  else {
    nodes = populate
      ? await Node.find(where)
        .populate("type")
        .populate("campus")
        .populate("category")
      // .populate("block")
      // .populate("detail")
        .sort({ createdAt: -1 })
      : await Node.find(where).sort({ createdAt: -1 });
  }

  if (populate) nodes = await Promise.all(nodes.map(populateDetail));

  return nodes;
};

const getAllNodesCoordinates = async (
  where = {},
  skip,
  limit,
  adjacencies = false,
  // Para saber si envío todas las adyacencias del nodo o solo donde es destino
  allAdjacencies = true
) => {
  const nodes = await Node.find(where)
    .select(["latitude", "longitude", "type", "available"])
    .populate("type", ["name"])
    .populate("campus", ["name"])
    .populate("detail", ["title"])
    .sort({ createdAt: -1 })
    .lean();

  await Promise.all(
    nodes.map(async (node) => {
      node.type = node.type?.name || null;
      node.name =
        node.type === ROUTE_NODO_TYPE
          ? `Nodo ruta - ${node.campus?.name || ""}`
          : node?.detail?.title
            ? `${node?.detail?.title || ""} - ${node.campus?.name || ""}`
            : "Sin datos";
      node.color = COLORS_DICTIONARY[node.type];
      node.coordinates = [node.latitude, node.longitude];
      node.detail = undefined;

      if (adjacencies) {
        if (!allAdjacencies) {
          node.adjacencies = await Adjacency.find({ origin: node._id })
            .populate("destination")
            .lean();
        } else {
          //
          node.adjacencies = await Adjacency.find({
            $or: [{ origin: node._id }, { destination: node._id }],
          })
            .populate("origin")
            .populate("destination")
            .lean();

          node.adjacencies.map((adj) => {
            if (node._id.toString() === adj.destination?._id.toString()) {
              adj.destination = adj.origin;
            }
          });
        }

        await Promise.all(
          node.adjacencies.map(async (adj) => {
            if (adj.destination) {
              adj.destinationCoordinates = [
                adj.destination?.latitude,
                adj.destination?.longitude,
              ];

              if (adj.destination.detail) {
                const detail = await Detail.findOne({
                  _id: adj.destination.detail,
                });

                adj.destinationName = detail?.title || "s/n";
              } else {
                adj.destinationName = "Nodo Ruta";
              }
            }

            adj.destination = adj.destination?._id;
            delete adj.createdAt;
            delete adj.origin;
            delete adj.deletedAt;
            delete adj.__v;
          })
        );
      }

      delete node.campus;
    })
  );

  return nodes;
};

const getCountNodes = async (where = {}) => {
  const countNodes = await Node.count(where);

  return countNodes;
};

const getNodeById = async (_id, adjacencies = true) => {
  if (!isValidObjectId(_id))
    throw new ValidationError("El id debe ser un ObjectId");

  let node = await Node.findOne({ _id })
    .populate("type")
    .populate("campus")
    .populate("category");
  // .populate("block")
  // .populate("detail");

  if (!node) throw new NotExist("Nodo no encontrado");

  node = await populateDetail(node);

  if (adjacencies) {
    node.adjacencies = await Adjacency.find({ origin: node._id })
      .populate("destination")
      .lean();

    node.adjacencies.map((adj) => {
      if (adj.destination) {
        adj.destinationCoordinates = [
          adj.destination?.latitude,
          adj.destination?.longitude,
        ];
      }

      adj.destination = adj.destination?._id;
      delete adj.createdAt;
      delete adj.origin;
      delete adj.deletedAt;
      delete adj.__v;
    });
  }

  return node;
};

const updateNodeById = async (_id, nodeData) => {
  let node = await getNodeById(_id);

  node = await Node.findByIdAndUpdate(_id, nodeData);

  return node;
};

const updateNodeWithDetailById = async (_id, nodeData) => {
  let node = await getNodeById(_id);

  const { detail, ...newData } = nodeData;
  node = await Node.findByIdAndUpdate(_id, newData);

  if (detail) {
    const { _id: detailId, ...newDetail } = detail;
    node.detail = await detailService.updateDetailById(detailId, newDetail);
  }

  return node;
};

const deleteNodeById = async (_id) => {
  const toDelete = await getNodeById(_id);
  const detail = toDelete.detail?._id;

  // Elimino los detalles y subnodos que tiene una relación fuerte
  if (detail) {
    await detailService.deleteDetailById(detail);
    await SubNode.deleteMany({ detail });
  }

  const deletedNode = await Node.findByIdAndRemove(_id);

  if (!deletedNode) throw new ValidationError("Nodo no encontrado");

  await Adjacency.deleteMany({ $or: [{ origin: _id }, { destination: _id }] });

  return deletedNode;
};

const timeCoordinates = async (origin, destination, speed) => {
  if (speed <= 0) {
    throw new ValidationError("La velocidad tiene que ser mayor a 0");
  }

  const secondsStimate = await timeBetweenCoordinates(
    origin,
    destination,
    speed
  );

  const minutes = Math.floor(secondsStimate / 60);
  const seconds = Math.round(secondsStimate % 60);

  return { minutes, seconds };
};

const getNodeByNomenclature = async (
  campusSymbol = "",
  blockNumber,
  floor,
  environment
) => {
  const campus = await Campus.findOne({
    symbol: campusSymbol.trim(),
  });

  if (!campus) {
    throw new NotExist(`El campus ${campusSymbol} no existe`);
  }

  const block = await Block.findOne({
    number: parseInt(blockNumber),
    campus: campus._id,
  });

  if (!block) {
    throw new NotExist(`El bloque ${campusSymbol}${blockNumber} no existe`);
  }

  if (campus?._id?.toString() !== block?.campus?.toString()) {
    throw new ValidationError(
      `El bloque ${blockNumber} no pertenece al campus ${campusSymbol}`
    );
  }

  const node = await Node.findOne({ _id: block?.node, deletedAt: null })
    .populate("detail")
    .lean();

  if (!node) {
    throw new NotExist("No se ha encontrado la información del lugar");
  }

  node.floor = floor;
  node.environment = environment;
  node.block = block;
  node.campus = campus;

  const message = generateLocationString(node);

  return {
    message,
    node: {
      _id: node._id,
      name: node.detail?.title || "Bloque " + block.number,
      img: node.detail?.img || null,
      latitude: node.latitude,
      longitude: node.longitude,
    },
  };
};

module.exports = {
  nodeAlreadyExists,
  createNode,
  createNodeWithDetail,
  updateNodeWithDetailById,
  getNodes,
  getAllNodesCoordinates,
  getCountNodes,
  getNodeById,
  updateNodeById,
  deleteNodeById,
  timeCoordinates,
  getNodeByNomenclature,
};
