const NotExist = require("../errors/NotExist");
const typeService = require("./typeService");
const nodeService = require("./nodeService");
const { BLOCK_NODO_TYPE } = require("../constants/index");
const ValidationError = require("../errors/ValidationError");

const getBlockNodeTypeId = async () => {
  const blockType = await typeService.getOneType({
    name: BLOCK_NODO_TYPE,
    deletedAt: null,
  });

  if (!BLOCK_NODO_TYPE)
    throw new ValidationError("No se ha encontrado el tipo de nodo bloque");

  return blockType._id;
};

const createBlockNode = async (newNode) => {
  newNode.type = await getBlockNodeTypeId();

  const createdNode = await nodeService.createNodeWithDetail(newNode);

  return createdNode;
};

const getBlockNodes = async (where = {}, skip, limit) => {
  where.type = await getBlockNodeTypeId();

  const nodes = await nodeService.getNodes(where, skip, limit);

  return nodes;
};

const getCountBlockNodes = async (where = {}) => {
  where.type = await getBlockNodeTypeId();

  const countNodes = await nodeService.getCountNodes(where);

  return countNodes;
};

const getBlockNodeById = async (id) => {
  const node = await nodeService.getNodeById(id);

  const blockTypeID = await getBlockNodeTypeId();

  if (node.type?._id?.toString() !== blockTypeID.toString())
    throw new NotExist("Nodo bloque no encontrado");

  return node;
};

const updateBlockNodeById = async (id, nodeData) => {
  let node = await getBlockNodeById(id);

  node = await nodeService.updateNodeWithDetailById(id, nodeData);

  return node;
};

const deleteBlockNodeById = async (id) => {
  await getBlockNodeById(id);

  const deletedNode = await nodeService.deleteNodeById(id);

  return deletedNode;
};

module.exports = {
  createBlockNode,
  getBlockNodes,
  getCountBlockNodes,
  getBlockNodeById,
  updateBlockNodeById,
  deleteBlockNodeById,
};
