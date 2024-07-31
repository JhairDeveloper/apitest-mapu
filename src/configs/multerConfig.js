const multer = require("multer");

// Configuración de multer
const storage = multer.memoryStorage();
const upload = multer({ storage });

module.exports = { upload };
