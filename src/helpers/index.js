const { EARTH_RADIUS_M } = require("../constants");
const { Types } = require("mongoose");
const crypto = require("crypto");
const qrcode = require("qrcode");

// Función para convertir grados a radianes
function degreesToRadians(degrees) {
  return degrees * (Math.PI / 180);
}

/**
 * Calcula la distancia en metros entre dos coordenadas [latitud, longitud] usando la fórmula de Haversine
 * @param {[number, number]} coordinateA Coordenada de origen
 * @param {[number, number]} coordinateB Coordenada de destino
 * @return {number} Distancia en metros
 */

// Función para calcular la distancia entre dos coordenadas geográficas en metros
const getDistanceBetweenCoordinates = (latA, lonA, latB, lonB) => {
  const earthRadius = 6371000; // Radio de la Tierra en metros

  const latARad = degreesToRadians(latA);
  const lonARad = degreesToRadians(lonA);
  const latBRad = degreesToRadians(latB);
  const lonBRad = degreesToRadians(lonB);

  const dLat = latBRad - latARad;
  const dLon = lonBRad - lonARad;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(latARad) *
      Math.cos(latBRad) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const distance = earthRadius * c;

  return distance;
};

/**
 * Valida un polígono geográfico de coordenadas
 * @param {Array} polygon Polígono geográfico de coordenadas
 * @return {Boolean} Es valido
 */
const isValidPolygon = (polygon) => {
  if (!Array.isArray(polygon)) return false;

  for (const coordinate of polygon) {
    if (!Array.isArray(coordinate)) return false;
    const [lat, lon] = coordinate;

    if (typeof lat !== "number" || typeof lon !== "number") return false;
  }

  return true;
};

/**
 * Valida si un string es un objectId válido
 * @param {String} string Id
 * @return {Boolean} Es valido
 */
const isValidObjectId = Types.ObjectId.isValid;

/**
 * Genera un string urlFriendly, que puede servir como token
 * @return {String} Devuelve token
 */
const generateUrlFriendlyToken = () => {
  return crypto.randomBytes(32).toString("hex");
};

/**
 * Genera una fecha del inicio de un mes y año pasado como parámetro
 * @param {Number} month Mes del año
 * @param {Number} year Año
 * @return {Date} Fecha del inicio del año
 */
const getStartOfMonth = (month, year) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // Los meses en JavaScript van de 0 a 11

  const targetYear = year || currentYear;
  const targetMonth = month || currentMonth;

  const startDate = new Date(targetYear, targetMonth - 1, 1, 0, 0, 0); // Inicio del primer día del mes
  startDate.setHours(startDate.getHours() - 5); // Ajuste al horario de Ecuador (UTC-5)

  return startDate;
};

/**
 * Valida un polígono geográfico de coordenadas
 * @param {Array} polygon Polígono geográfico de coordenadas
 * @return {Boolean} Es valido
 */
const getEndOfMonth = (month, year) => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth() + 1; // Los meses en JavaScript van de 0 a 11

  const targetYear = year || currentYear;
  const targetMonth = month || currentMonth;

  const endDate = new Date(targetYear, targetMonth, 0, 23, 59, 59); // Fin del último día del mes
  endDate.setHours(endDate.getHours() - 5); // Ajuste al horario de Ecuador (UTC-5)

  return endDate;
};

/**
 * Crea un código QR desde una cadena de texto
 * @param {String} text Texto a transformar en QR
 * @returns {String} datos del código QR
 */
const generateQRcode = async (text) => {
  try {
    const qrCodeDataURL = await qrcode.toDataURL(text);
    return qrCodeDataURL;
  } catch (error) {
    console.error("Error al generar el código QR:", error);
    throw error;
  }
};

const timeBetweenCoordinates = (origin, destination, speed) => {
  const distance = getDistanceBetweenCoordinates(origin, destination);

  const time = distance / speed;

  return time;
};

function cardinalToOrdinalLetters(number) {
  if (typeof number !== "number" || Number.isNaN(number)) {
    return "";
    // throw new Error('El valor ingresado debe ser un número válido.');
  }

  const units = [
    "",
    "primer",
    "segundo",
    "tercer",
    "cuarto",
    "quinto",
    "sexto",
    "séptimo",
    "octavo",
    "noveno",
  ];
  const tens = [
    "",
    "décimo",
    "vigésimo",
    "trigésimo",
    "cuadragésimo",
    "quincuagésimo",
    "sexagésimo",
    "septuagésimo",
    "octogésimo",
    "nonagésimo",
  ];

  if (number >= 1 && number <= 9) {
    return units[number];
  }

  const tensDigit = Math.floor(number / 10);
  const unitsDigit = number % 10;

  return tens[tensDigit] + (unitsDigit > 0 ? ` ${units[unitsDigit]}` : "");
}

function generateLocationString(node) {
  const { block, floor, environment, detail } = node;

  const campusSymbol = node.campus?.symbol || "";
  const blockNumber = block?.number || "";
  const floorString = floor
    ? `${cardinalToOrdinalLetters(parseInt(floor))} piso del`
    : "";
  const blockTitle = detail?.title || "Bloque sin nombre";
  const campusName = node.campus?.name
    ? `del campus '${node.campus?.name}'`
    : "campus";

  const completeNomenclature = `${campusSymbol} ${blockNumber} ${floor || ""} ${
    environment || ""
  }`;

  const locationString = `El espacio ${completeNomenclature.trim()} se encuentra en el ${floorString} ${blockTitle} ${campusName}`;

  return locationString.trim();
}

const getBlockNumberByTitle = (str = "") => str.split(" ")[1] || "-";

module.exports = {
  getDistanceBetweenCoordinates,
  degreesToRadians,
  isValidPolygon,
  isValidObjectId,
  generateUrlFriendlyToken,
  getStartOfMonth,
  getEndOfMonth,
  generateQRcode,
  timeBetweenCoordinates,
  cardinalToOrdinalLetters,
  generateLocationString,
  getBlockNumberByTitle,
};
