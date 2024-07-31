// const xlsx = require("xlsx");

// Función para generar un archivo Excel a partir de headers y data
function generateExcel(headers = [], data = [], sheetName = "Hoja1") {
  // try {
  //   const worksheet = xlsx.utils.json_to_sheet(data, { header: headers });
  //   const workbook = xlsx.utils.book_new();
  //   xlsx.utils.book_append_sheet(workbook, worksheet, sheetName);
  //   // Generar el archivo Excel
  //   const excelBuffer = xlsx.write(workbook, {
  //     type: "buffer",
  //     bookType: "xlsx",
  //   });
  //   return excelBuffer;
  // } catch (err) {
  //   console.error("Error al generar el archivo Excel:", err);
  //   throw new Error("Error al generar el archivo Excel");
  // }
}

module.exports = generateExcel;
