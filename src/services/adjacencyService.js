const helpers = require("../helpers/index");
const Adjacency = require("../models/Adjacency");
const Node = require("../models/Node");
const validateAdjacenciesExcelFile = require("../helpers/validateAdjacenciesFile");
const { uploadImageToS3 } = require("../helpers/s3Helpers");
const NotExist = require("../errors/NotExist.js");
const ValidationError = require("../errors/ValidationError.js");

// Me pasarían algo así:
// [{
// node: "12345",
// adjacencies: [{
//    node: "67890"
// }]
// },
// ...]
const createAdjacencies = async (nodesWithAdjacencies) => {
  const results = [];

  const createdAdjacenciesIds = [];
  try {
    await Promise.all(
      nodesWithAdjacencies.map(async (node) => {
        // Cada adyacencia
        const { adjacencies = [], _id: originId, toDelete = [] } = node;

        // Elimino las adyacencias enviadas
        await Adjacency.deleteMany({ _id: { $in: toDelete } });

        await Promise.all(
          adjacencies.map(async ({ destination, _id }) => {
            if (!_id) {
              const newAdjacency = await createAdjacency(originId, destination);

              createdAdjacenciesIds.push(newAdjacency._id);
            }
          })
        );

        results.push({ originId, adjacencies: createdAdjacenciesIds });
      })
    );
  } catch (error) {
    await Adjacency.deleteMany({ _id: { $in: createdAdjacenciesIds } });

    throw error;
  }

  return results;
};

const createAdjacency = async (originId, destinationId) => {
  const originNode = await Node.findOne({ _id: originId, deletedAt: null });
  const destinityNode = await Node.findOne({
    _id: destinationId,
    deletedAt: null,
  });

  if (!originNode) throw new NotExist("Nodo de origen no encontrado");
  if (!destinityNode) throw new NotExist("Nodo de destino no encontrado");

  const adjacencyAlreadyExists = await Adjacency.findOne({
    $or: [
      { origin: originId, destination: destinationId },
      { origin: destinationId, destination: originId },
    ],
  });

  if (adjacencyAlreadyExists)
    throw new ValidationError(
      `Ya existe una adyacencia entre los nodos dados: ${originId} - ${destinationId}`
    );

  const weight = helpers.getDistanceBetweenCoordinates(
    originNode.latitude,
    originNode.longitude,
    destinityNode.latitude,
    destinityNode.longitude
  );

  const adjacency = await Adjacency.create({
    origin: originId,
    destination: destinationId,
    weight,
  });

  return adjacency;
};

const getNodeAdjacencies = async (node, populate = false, where = {}) => {
  const adjacencies = populate
    ? await Adjacency.find({
      ...where,
      $or: [{ origin: node }, { destination: node }],
    })
      .populate("origin")
      .populate("destination")
      .lean()
    : await Adjacency.find({
      ...where,
      $or: [{ origin: node }, { destination: node }],
    }).lean();

  return adjacencies;
};

const getNodeAdjacenciesCount = async (node) => {
  const count = await Adjacency.count({
    $or: [{ origin: node }, { destination: node }],
  });

  return count;
};

const getAllAdjacencies = async (where = {}, populate = false) => {
  where.deletedAt = null;

  const adjacencies = populate
    ? await Adjacency.find(where)
      .populate("origin")
      .populate("destination")
      .lean()
    : await Adjacency.find(where).lean();

  return adjacencies;
};

const getAllAdjacenciesCount = async (where = {}) => {
  const count = await Adjacency.count(where);

  return count;
};

const deleteAdjacencies = async (adjacencies) => {
  const deleted = await Promise.all(
    adjacencies.map(
      async (adjacency) => await Adjacency.deleteOne({ _id: adjacency })
    )
  );

  return deleted;
};

const masiveUpload = async (file) => {
  const { valid, errorsFile, rows } = await validateAdjacenciesExcelFile(file);

  // Si el archivo es válido, creo las adyacencias
  if (valid) {
    const results = await Promise.all(
      rows.map(async (row) => {
        return await createAdjacency(row.ORIGEN, row.DESTINO);
      })
    );

    return { valid, results };
  } else {
    // Sino devuelvo el error
    const { Location: errorsURL } = await uploadImageToS3(
      errorsFile,
      "xlsx",
      "validations",
      true
    );

    return { valid, errorsURL };
  }
};

module.exports = {
  createAdjacencies,
  createAdjacency,
  getNodeAdjacencies,
  getAllAdjacencies,
  getNodeAdjacenciesCount,
  getAllAdjacenciesCount,
  deleteAdjacencies,
  masiveUpload,
};
