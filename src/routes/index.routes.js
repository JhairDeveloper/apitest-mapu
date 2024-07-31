const { Router } = require("express");
const {
  COLORS_DICTIONARY,
  SPANISH_COLORS_DICTIONARY,
} = require("../constants");
const SubNode = require("../models/SubNode");
const Detail = require("../models/Detail");
const Node = require("../models/Node");
const { getBlockNumberByTitle } = require("../helpers");
// const middlewares = require("../middlewares");
// const isLoggedIn = require("../policies/isLoggedIn");

const indexRouter = Router();

/**
 * @route GET /
 * @desc Ruta de ejemplo, devuelve un json fijos
 * @access Public
 */
indexRouter.get("/", async (req, res, next) => {
  res.json({ message: "El servidor está funcionando :)" });
});

/**
 * @route GET /
 * @desc Obtener todos las usuarios
 * @access Public
 */

indexRouter.get("/node-type-colors", (req, res) => {
  const results = { ...COLORS_DICTIONARY };

  for (const key in COLORS_DICTIONARY) {
    results[key] =
      SPANISH_COLORS_DICTIONARY[COLORS_DICTIONARY[key]] || "Sin color";
  }

  res.json(results);
});

const getRegex = (search = "") => {
  // Escapar caracteres especiales para evitar problemas con la búsqueda regex
  const escapedSearch = search.replace(/[.*+\-?^${}()|[\]\\]/g, "\\$&");

  // Crear una expresión regular para buscar el término con ignorar mayúsculas y minúsculas
  const regex = new RegExp(escapedSearch, "i");

  return regex;
};

const formatSubnodes = async (subnode) => {
  const {
    latitude,
    longitude,
    name,
    description,
    img,
    nomenclature = {},
    detail = {},
  } = subnode;
  const node = await Node.findOne({ detail: detail?._id }).populate("campus");

  nomenclature.campus = node?.campus?.symbol;
  nomenclature.block = getBlockNumberByTitle(detail.title);
  return {
    _id: node?._id,
    latitude,
    longitude,
    title: name,
    description,
    img,
    campusName: node?.campus?.name,
    nomenclature,
  };
};

const formatNode = (node) => {
  const { latitude, longitude, detail = {}, campus = {}, _id } = node;

  return {
    _id,
    latitude,
    longitude,
    title: detail?.title || null,
    description: detail?.description || null,
    img: detail?.img || null,
    campusName: campus?.name || null,
    nomenclature: {
      campus: campus?.symbol || null,
    },
  };
};

/**
 * @route GET /
 * @desc Obtener nodos de interés
 * @access Public
 */
indexRouter.get("/search", async (req, res, next) => {
  const { search } = req.query;

  if (!search) return next({ message: "El campo search es requerido" });

  const $regex = getRegex(search);

  // Debo devolver todos los subnodos que coincidan y nodos de interés, bloque o acceso
  const whereSubnode = { name: { $regex } };
  const whereDetail = { title: { $regex } };

  const subnodes = await SubNode.find(whereSubnode).populate("detail").lean();
  const details = await Detail.find(whereDetail).lean();

  const nodes = await Node.find({ detail: { $in: details.map((d) => d._id) } })
    .populate("detail")
    .populate("campus")
    .lean();

  const mapedNodes = await Promise.all(nodes.map(formatNode));
  const mapedSubnodes = await Promise.all(subnodes.map(formatSubnodes));

  const results = [...mapedNodes, ...mapedSubnodes];

  res.json({ totalCount: results.length, results });
});

module.exports = indexRouter;
