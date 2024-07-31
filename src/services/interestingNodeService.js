const NotExist = require("../errors/NotExist");
const typeService = require("./typeService");
const detailService = require("./detailService");
const nodeService = require("./nodeService");
const { INTEREST_NODO_TYPE } = require("../constants/index");
const validateInterestingExcelFile = require("../helpers/validateInterestingFile");
const { uploadImageToS3 } = require("../helpers/s3Helpers");

const getInterestingNodeTypeId = async () => {
  const accessType = await typeService.getOneType({
    name: INTEREST_NODO_TYPE,
    deletedAt: null,
  });

  return accessType._id;
};

const createInterestingNode = async (newNode) => {
  newNode.type = await getInterestingNodeTypeId();

  const createdNode = await nodeService.createNodeWithDetail(newNode);

  return createdNode;
};

const getInterestingNodes = async (where = {}, skip, limit, search) => {
  where.type = await getInterestingNodeTypeId();

  await applyRegex(where, search);

  const nodes = await nodeService.getNodes(where, skip, limit);

  return nodes;
};

const applyRegex = async (where, search) => {
  if (search) {
    // Escapar caracteres especiales para evitar problemas con la búsqueda regex
    const escapedSearch = search.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&");

    // Crear una expresión regular para buscar el término con ignorar mayúsculas y minúsculas
    const regex = new RegExp(escapedSearch, "i");
    const matchedDetails = await detailService.getDetailes({ title: { $regex: regex } });

    // Obtener los IDs de los detalles encontrados
    const matchedDetailIds = matchedDetails.map(detail => detail._id);
    where["detail"] = { $in: matchedDetailIds };
  }
};

const getCountInterestingNodes = async (where = {}, search) => {
  where.type = await getInterestingNodeTypeId();

  await applyRegex(where, search);

  const countNodes = await nodeService.getCountNodes(where);

  return countNodes;
};

const getInterestingNodeById = async (id) => {
  const node = await nodeService.getNodeById(id);

  const interestingTypeID = await getInterestingNodeTypeId();

  if (node.type?._id?.toString() !== interestingTypeID.toString())
    throw new NotExist("Nodo de interés no encontrado");

  return node;
};

const updateInterestingNodeById = async (id, nodeData) => {
  let node = await getInterestingNodeById(id);

  node = await nodeService.updateNodeWithDetailById(id, nodeData);

  return node;
};

const deleteInterestingNodeById = async (id) => {
  await getInterestingNodeById(id);

  const deletedNode = await nodeService.deleteNodeById(id);

  return deletedNode;
};

const masiveUpload = async (file) => {
  const { valid, errorsFile, rows } = await validateInterestingExcelFile(file);
  
  if (valid) {
    const results = await Promise.all(
      rows.map(async (row) => {
        return await createInterestingNode(mapInterestingNode(row));
      })
    );

    return { valid, results };
  } else {
    const { Location: errorsURL } = await uploadImageToS3(
      errorsFile,
      "xlsx",
      "validations",
      true
    );
      
    return { valid, errorsURL };
  }
};

const mapInterestingNode = (row) => {
  const result = {};

  result.campus = row.CAMPUS;
  result.category = row.CATEGORIA;
  result.detail = {
    title: row.TITULO,
    description: row.DESCRIPCION || null,
    img: row.IMAGEN || null,
  };
  result.latitude = row.LATITUD;
  result.longitude = row.LONGITUD;

  return result;
};

module.exports = {
  createInterestingNode,
  getInterestingNodes,
  getCountInterestingNodes,
  getInterestingNodeById,
  updateInterestingNodeById,
  deleteInterestingNodeById,
  masiveUpload,
};
