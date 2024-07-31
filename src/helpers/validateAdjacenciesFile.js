const { OBJECT_ID_REGEX } = require("../constants");
const readExcelFile = require("./readExcelFile");
const generateExcel = require("./generateExcelFile");
const Node = require("../models/Node");

const nodeIsValid = async (_id) => {
  const node = await Node.findOne({ _id }).lean();

  return !!node;
};

// Función para validar un archivo Excel y generar el archivo con errores
async function validateAdjacenciesExcelFile(file) {
  try {
    const jsonData = readExcelFile(file);

    const headers = ["ORIGEN", "DESTINO"];
    const errors = [];
    let isValid = true;

    for (const row of jsonData) {
      const errorRow = { ...row, ERRORES: [] };

      // Validar headers
      const headerKeys = Object.keys(row);
      const missingHeaders = headers.filter(
        (header) => !headerKeys.includes(header)
      );
      if (missingHeaders.length > 0) {
        errorRow.ERRORES.push(
          `Faltan los siguientes encabezados: ${missingHeaders.join(", ")}`
        );
      }

      if (!row.ORIGEN || !OBJECT_ID_REGEX.test(row.ORIGEN)) {
        errorRow.ERRORES.push(
          "El campo ORIGEN debe ser un ObjectId válido y requerido."
        );
      } else {
        const nodeValid = await nodeIsValid(row.ORIGEN);

        if (!nodeValid) errorRow.ERRORES.push("El ORIGEN indicado no existe");
      }

      if (!row.DESTINO || !OBJECT_ID_REGEX.test(row.DESTINO)) {
        errorRow.ERRORES.push(
          "El campo DESTINO debe ser un ObjectId válido y requerido."
        );
      } else {
        const nodeValid = await nodeIsValid(row.DESTINO);

        if (!nodeValid) errorRow.ERRORES.push("El DESTINO indicado no existe");
      }

      if (errorRow.ERRORES.length > 0) {
        isValid = false;
        errorRow.ERRORES = `Se han encontrado algunos errores: ${errorRow.ERRORES.join(
          ". "
        )}`;
      } else {
        errorRow.ERRORES = null;
      }

      // console.log(errorRow.ERRORES);

      errors.push(errorRow);
    }

    if (!isValid) {
      const excelBuffer = generateExcel(
        [...headers, "ERRORES"],
        errors,
        "ERRORES encontrados"
      );

      return { valid: false, errorsFile: excelBuffer };
    } else {
      return { valid: true, rows: jsonData };
    }
  } catch (err) {
    console.error("Error al validar el archivo Excel:", err);

    throw new Error("Error al validar el archivo Excel");
  }
}

module.exports = validateAdjacenciesExcelFile;
