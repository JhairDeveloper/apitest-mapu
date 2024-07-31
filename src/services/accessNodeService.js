const NotExist = require("../errors/NotExist");
const typeService = require("./typeService");
const nodeService = require("./nodeService");
const { ACCESS_NODO_TYPE } = require("../constants/index");
const validateAccessNodesExcelFile = require("../helpers/validateAccessFile");
const { uploadImageToS3 } = require("../helpers/s3Helpers");

const mapAccessNode = (row) => {
  const result = {};

  result.latitude = row.LATITUD;
  result.longitude = row.LONGITUD;
  result.campus = row.CAMPUS;
  result.detail = {
    title: row.TITULO,
    description: null,
    img: row.IMAGEN || null,
    category: row.CATEGORIA,
  };

  return result;
};

const getAccessNodeTypeId = async () => {
  const accessType = await typeService.getOneType({
    name: ACCESS_NODO_TYPE,
    deletedAt: null,
  });

  return accessType._id;
};

const createAccessNode = async (newNode) => {
  newNode.type = await getAccessNodeTypeId();

  const createdNode = await nodeService.createNodeWithDetail(newNode);

  return createdNode;
};

const getAccessNodes = async (where = {}, skip, limit) => {
  where.type = await getAccessNodeTypeId();

  const nodes = await nodeService.getNodes(where, skip, limit);

  return nodes;
};

const getCountAccessNodes = async (where = {}) => {
  where.type = await getAccessNodeTypeId();

  const countNodes = await nodeService.getCountNodes(where);

  return countNodes;
};

const getAccessNodeById = async (id) => {
  const node = await nodeService.getNodeById(id);

  const accessTypeID = await getAccessNodeTypeId();

  console.log(node.type._id, accessTypeID);

  if (node.type?._id?.toString() !== accessTypeID.toString())
    throw new NotExist("Nodo de acceso no encontrado");

  return node;
};

const updateAccessNodeById = async (id, nodeData) => {
  let node = await getAccessNodeById(id);

  node = await nodeService.updateNodeWithDetailById(id, nodeData);
  return node;
};

const deleteAccessNodeById = async (id) => {
  await getAccessNodeById(id);

  const deletedNode = await nodeService.deleteNodeById(id);

  return deletedNode;
};

const masiveUpload = async (file) => {
  const { valid, errorsFile, rows } = await validateAccessNodesExcelFile(file);

  // Si el archivo es válido, creo los bloques
  if (valid) {
    const results = await Promise.all(
      rows.map(async (row) => {
        return await createAccessNode(mapAccessNode(row));
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
  createAccessNode,
  getAccessNodes,
  getCountAccessNodes,
  getAccessNodeById,
  updateAccessNodeById,
  deleteAccessNodeById,
  masiveUpload,
};
