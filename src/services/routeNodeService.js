const NotExist = require("../errors/NotExist");
const typeService = require("./typeService");
const nodeService = require("./nodeService");
const { ROUTE_NODO_TYPE } = require("../constants/index");
const validateRouteNodesExcelFile = require("../helpers/validateRouteNodeFile");
const { uploadImageToS3 } = require("../helpers/s3Helpers");

const getRouteNodeTypeId = async () => {
  const routeType = await typeService.getOneType({
    name: ROUTE_NODO_TYPE,
    deletedAt: null,
  });

  return routeType._id;
};

const createRouteNode = async (newNode) => {
  newNode.type = await getRouteNodeTypeId();

  const createdNode = await nodeService.createNode(newNode);

  return createdNode;
};

const getRouteNodes = async (where = {}, skip, limit) => {
  where.type = await getRouteNodeTypeId();

  const nodes = await nodeService.getNodes(where, skip, limit);

  return nodes;
};

const getCountRouteNodes = async (where = {}) => {
  where.type = await getRouteNodeTypeId();

  const countNodes = await nodeService.getCountNodes(where);

  return countNodes;
};

const getRouteNodeById = async (id) => {
  const node = await nodeService.getNodeById(id);

  const routeTypeID = await getRouteNodeTypeId();

  if (node.type?._id?.toString() !== routeTypeID.toString())
    throw new NotExist("Nodo de ruta no encontrado");

  return node;
};

const updateRouteNodeById = async (id, nodeData) => {
  let node = await getRouteNodeById(id);

  node = await nodeService.updateNodeById(id, nodeData);

  return node;
};

const deleteRouteNodeById = async (id) => {
  await getRouteNodeById(id);

  const deletedNode = await nodeService.deleteNodeById(id);

  return deletedNode;
};

const mapRouteNode = (row) => {
  const result = {};

  result.latitude = row.LATITUD;
  result.longitude = row.LONGITUD;
  result.campus = row.CAMPUS;

  return result;
};

const masiveUpload = async (file) => {
  const { valid, errorsFile, rows } = await validateRouteNodesExcelFile(file);

  // Si el archivo es válido, creo los bloques
  if (valid) {
    const results = await Promise.all(
      rows.map(async (row) => {
        return await createRouteNode(mapRouteNode(row));
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
  createRouteNode,
  getRouteNodes,
  getCountRouteNodes,
  getRouteNodeById,
  updateRouteNodeById,
  deleteRouteNodeById,
  masiveUpload,
};
