const EARTH_RADIUS_M = 6371e3;

const LIMIT_ACCESS_POINTS_BY_CAMPUS = 7;

//! Latitud (latitud geográfica):
// Rango válido: -90° a +90°
// El ecuador se encuentra a 0° de latitud.
// El Polo Norte está a +90° de latitud.
// El Polo Sur está a -90° de latitud.
//! Longitud (longitud geográfica):
// Rango válido: -180° a +180°
// El meridiano de Greenwich se encuentra a 0° de longitud.
// Las longitudes al este de Greenwich están en el rango de 0° a +180°.
// Las longitudes al oeste de Greenwich están en el rango de 0° a -180°.
const MIN_LAT = -90;
const MAX_LAT = 90;
const MIN_LON = -180;
const MAX_LON = 180;

const OBJECT_ID_REGEX = /^[0-9a-fA-F]{24}$/;

//! Tipos de rol
const NORMAL_ROLE_NAME = "Normal";
const ADMIN_ROLE_NAME = "Administrador";

//! Tipos de reporte
const NODE = "NODE";
const SUBNODE = "SUBNODE";
const LOSTPOINT = "LOSTPOINT";

//! Tipos de nodo
// Ya no se usan
const ENTRANCE_NODO_TYPE = "Entrada";
const VIA_NODO_TYPE = "Vía";
// Se usan
const ROUTE_NODO_TYPE = "Ruta";
const INTEREST_NODO_TYPE = "Interés";
const ACCESS_NODO_TYPE = "Acceso";
const BLOCK_NODO_TYPE = "Bloque";

const COLORS_DICTIONARY = {
  [ROUTE_NODO_TYPE]: "green",
  [INTEREST_NODO_TYPE]: "blue",
  [ACCESS_NODO_TYPE]: "red",
  [BLOCK_NODO_TYPE]: "violet",
};

const SPANISH_COLORS_DICTIONARY = {
  green: "Verde",
  blue: "Azul",
  red: "Rojo",
  violet: "Violeta",
};

module.exports = {
  EARTH_RADIUS_M,
  NORMAL_ROLE_NAME,
  ADMIN_ROLE_NAME,
  NODE,
  SUBNODE,
  LOSTPOINT,
  ACCESS_NODO_TYPE,
  BLOCK_NODO_TYPE,
  ENTRANCE_NODO_TYPE,
  INTEREST_NODO_TYPE,
  ROUTE_NODO_TYPE,
  VIA_NODO_TYPE,
  LIMIT_ACCESS_POINTS_BY_CAMPUS,
  MIN_LAT,
  MAX_LAT,
  MIN_LON,
  MAX_LON,
  OBJECT_ID_REGEX,
  COLORS_DICTIONARY,
  SPANISH_COLORS_DICTIONARY,
};
