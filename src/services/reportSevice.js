const Report = require("../models/Report");
const lostPointService = require("../services/lostPointService");
const nodeService = require("../services/nodeService.js");
const subNodeService = require("../services/subNodeService");
const ValidationError = require("../errors/ValidationError");
const { isValidObjectId } = require("mongoose");
const constants = require("../constants/index");
const NotExist = require("../errors/NotExist");
const Detail = require("../models/Detail");

const createReport = async (reportData) => {
  const classifier = await classifierReport(reportData);

  await validateClassifierReport(classifier, reportData);

  const report = await Report.create(reportData);

  return report;
};

const validateClassifierReport = async (classifier, reportData) => {
  if (classifier === constants.NODE) {
    await nodeService.getNodeById(reportData.node);
  } else if (classifier === constants.SUBNODE) {
    await subNodeService.getSubNodeById(reportData.subnode);
  } else if (classifier === constants.LOSTPOINT) {
    const res = await lostPointService.findOrCreateLostPoint(
      reportData.lostPoint
    );

    reportData.lostPoint = res._id;
  } else {
    throw new ValidationError(
      "El reporte debe ser de tipo actualización o punto perdido"
    );
  }
};

const classifierReport = async (reportData) => {
  //* Si es de tipo Actualización, debe mandar ya sea un nodo o subnodo, y obligatoriamente el comentario
  if (reportData.subnode && reportData.comment) {
    reportData.node = null;
    reportData.lostPoint = null;

    return constants.SUBNODE;
  } else if (reportData.node && reportData.comment) {
    reportData.subnode = null;
    reportData.lostPoint = null;

    return constants.NODE;
  } else if (reportData.lostPoint && reportData.comment) {
    reportData.subnode = null;
    reportData.node = null;

    return constants.LOSTPOINT;
  } else {
    return null;
  }
};

const populateNode = async (report) => {
  if (report?.node?.detail) {
    const detail = await Detail.findOne({ _id: report?.node?.detail });

    report.node.name = detail?.title;
    report.node.description = detail?.description;
    report.node.detail = undefined;
  }
};

const getReports = async (where = {}, skip, limit, populate = true) => {
  let reports = [];

  if (populate) {
    reports = await Report.find(where)
      .populate("node", ["latitude", "longitude", "detail"])
      .populate("user", ["name", "lastname", "email", "avatar"])
      .populate("subnode", ["latitude", "longitude", "name", "description"])
      .populate("lostPoint", ["latitude", "longitude"])
      .skip(skip)
      .limit(limit)
      .lean();

    await Promise.all(reports.map(populateNode));
  } else {
    reports = await Report.find(where).skip(skip).limit(limit).lean();
  }

  reports.map((report) => {
    report.type = report.lostPoint ? "Punto perdido" : "Punto desactualizado";
  });

  return reports;
};

const getReportById = async (_id) => {
  if (!isValidObjectId(_id))
    throw new ValidationError("El id debe ser un ObjectId");

  const report = await Report.findOne({ _id })
    .populate("node", ["latitude", "longitude", "detail"])
    .populate("user", ["name", "lastname", "email", "avatar"])
    .populate("subnode", ["latitude", "longitude", "name", "description"])
    .populate("lostPoint", ["latitude", "longitude"])
    .lean();

  populateNode(report);

  if (!report) {
    throw new NotExist("Reporte no encontrado");
  }

  report.type = report.lostPoint ? "Punto perdido" : "Punto desactualizado";

  return report;
};

const getCountReports = async (where = {}) => {
  return await Report.count(where);
};

const updateReportById = async (_id, reportData) => {
  let report = await getReportById(_id);

  report = await Report.updateOne({ _id }, reportData);

  return report;
};

module.exports = {
  createReport,
  getReports,
  getReportById,
  getCountReports,
  updateReportById,
};
