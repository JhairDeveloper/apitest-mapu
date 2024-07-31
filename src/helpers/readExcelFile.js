// const xlsx = require("xlsx");

// Función helper para leer el archivo Excel y devolver el contenido de la primera hoja
function readExcelFile(file) {
  // try {
  //   const workbook = xlsx.read(file.buffer, { type: "buffer" });
  //   const firstSheetName = workbook.SheetNames[0];
  //   const firstSheet = workbook.Sheets[firstSheetName];
  //   const jsonData = xlsx.utils.sheet_to_json(firstSheet, { defval: "" });
  //   // No es necesario eliminar el archivo temporal cuando se usa buffer
  //   return jsonData;
  // } catch (err) {
  //   console.error("Error al leer el archivo Excel:", err);
  //   throw new Error("Error al leer el archivo Excel");
  // }
}

module.exports = readExcelFile;
