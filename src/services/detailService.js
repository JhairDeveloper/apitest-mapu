const { isValidObjectId } = require("mongoose");
const ValidationError = require("../errors/ValidationError");
const Detail = require("../models/Detail");
const SubNode = require("../models/SubNode");
const NotExist = require("../errors/NotExist");
const subNodesServices = require("./subNodeService");

const populateSubnodes = async (detail) => {
  const formated = detail.toJSON();

  formated.subnodes = await subNodesServices.getAllSubNodes({
    deletedAt: null,
    detail: detail._id,
  });

  return formated;
};

const createDetail = async (detailData) => {
  const { subnodes = [], ...newDetail } = detailData;

  const detail = await Detail.create(newDetail);

  detail.subnodes = [];
  await Promise.all(
    subnodes.map(async (subnode) => {
      subnode.detail = detail._id;

      const createdSubnode = await subNodesServices.createSubNode(subnode);

      detail.subnodes.push(createdSubnode);
    })
  );

  return detail;
};

const getDetailes = async (where = {}, skip, limit) => {
  let detailes = await Detail.find(where).skip(skip).limit(limit);

  detailes = await Promise.all(detailes.map(populateSubnodes));

  return detailes;
};

const getDetailById = async (id) => {
  if (!isValidObjectId(id))
    throw new ValidationError("El id debe ser un objectId");

  let detail = await Detail.findById(id);

  if (!detail) throw new NotExist("Detalle no encontrado");

  // Añado los subnodos q le correspondan
  detail = await populateSubnodes(detail);

  return detail;
};

const getCountDetailes = async (where = {}) => {
  const numberDetailes = await Detail.count(where);

  return numberDetailes;
};

const updateDetailById = async (id, detailData) => {
  await getDetailById(id);

  const { subnodes = [], ...toUpdate } = detailData;

  const updateDetail = await Detail.findByIdAndUpdate(id, toUpdate);

  updateDetail.subnodes = [];
  await Promise.all(
    subnodes.map(async (subnode) => {
      const { _id, detail, ...newSubnode } = subnode;

      let subnodeUpdated;

      if (_id) {
        subnodeUpdated = await subNodesServices.updateSubNode(_id, newSubnode);
      } else {
        subnodeUpdated = await subNodesServices.createSubNode({
          detail: id,
          ...newSubnode,
        });
      }

      updateDetail.subnodes.push(subnodeUpdated);
    })
  );

  return updateDetail;
};

const deleteDetailById = async (id) => {
  await getDetailById(id);

  const detailDeleted = await Detail.findByIdAndDelete(id);
  await SubNode.deleteMany({ _id: { $in: detailDeleted.subnodes } });

  return detailDeleted;
};

const deleteDetails = async (where = {}) => {
  if (Object.keys(where).lenght <= 0)
    throw new ValidationError("Proporcione un criterio de filtrado");

  const numberDetailesDeleted = await Detail.deleteMany(where);

  return numberDetailesDeleted;
};

module.exports = {
  createDetail,
  getDetailes,
  getDetailById,
  getCountDetailes,
  updateDetailById,
  deleteDetailById,
  deleteDetails,
};
