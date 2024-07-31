const { OBJECT_ID_REGEX } = require("../constants");
const readExcelFile = require("./readExcelFile");
const generateExcel = require("./generateExcelFile");
const { campusIsValid } = require("../validationSchemas/RouteNode");
const Faculty = require("../models/Faculty");
const Category = require("../models/Category");
const Block = require("../models/Block");

const blockNumberAlreadyExists = async (number, campus) => {
  const existingBlock = await Block.findOne({ number, campus });

  // console.log({ number, existingBlock });
  return !!existingBlock;
};

const categoryIsValid = async (category) => {
  // const result = await Category.findOne({ _id: category });

  return true;
};

const facultyIsValid = async (fac) => {
  const result = await Faculty.findOne({ _id: fac });

  return !!result;
};

// Función para validar un archivo Excel y generar el archivo con errores
async function validateBlocksExcelFile(file) {
  try {
    const jsonData = readExcelFile(file);

    const headers = [
      "NUMERO",
      "FACULTAD",
      "CAMPUS",
      "LATITUD",
      "LONGITUD",
      "DESCRIPCION",
      "IMAGEN",
      "CATEGORIA",
    ];
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

      // Validar campos
      if (!Number.isInteger(row.NUMERO) || row.NUMERO <= 0) {
        errorRow.ERRORES.push(
          "El campo NUMERO debe ser un número entero mayor a 0."
        );
      } else {
        const alreadyExists = await blockNumberAlreadyExists(
          row.NUMERO,
          row.CAMPUS
        );

        if (alreadyExists)
          errorRow.ERRORES.push(
            "Ya existe un bloque con este NUMERO en ese campus"
          );
      }

      // Validar FACULTAD y CAMPUS como ObjectId válido y requerido
      if (!row.FACULTAD || !OBJECT_ID_REGEX.test(row.FACULTAD)) {
        errorRow.ERRORES.push(
          "El campo FACULTAD debe ser un ObjectId válido y requerido."
        );
      } else {
        const facultyValid = await facultyIsValid(row.FACULTAD);

        if (!facultyValid)
          errorRow.ERRORES.push("La FACULTAD indicada no existe");
      }

      if (!row.CAMPUS || !OBJECT_ID_REGEX.test(row.CAMPUS)) {
        console.log(row.CAMPUS);
        errorRow.ERRORES.push(
          "El campo CAMPUS debe ser un ObjectId válido y requerido."
        );
      } else {
        const campusValid = await campusIsValid(row.CAMPUS);

        if (!campusValid) errorRow.ERRORES.push("El CAMPUS indicado no existe");
      }

      // Validar LATITUD y LONGITUD como números dentro del rango permitido
      if (
        typeof row.LATITUD !== "number" ||
        row.LATITUD < -90 ||
        row.LATITUD > 90
      ) {
        errorRow.ERRORES.push(
          "El campo LATITUD debe ser un número entre -90 y 90."
        );
      }
      if (
        typeof row.LONGITUD !== "number" ||
        row.LONGITUD < -180 ||
        row.LONGITUD > 180
      ) {
        errorRow.ERRORES.push(
          "El campo LONGITUD debe ser un número entre -180 y 180."
        );
      }

      // Validar DESCRIPCION con máximo 200 caracteres (opcional)
      if (row.DESCRIPCION && row.DESCRIPCION.length > 200) {
        errorRow.ERRORES.push(
          "El campo DESCRIPCION no debe tener más de 200 caracteres."
        );
      }

      // Validar IMAGEN como URL (opcional)
      if (row.IMAGEN && !/^https?:\/\/\S+$/.test(row.IMAGEN)) {
        errorRow.ERRORES.push("El campo IMAGEN debe ser una URL válida.");
      }

      // Validar CATEGORIA como ObjectId válido (opcional)
      if (row.CATEGORIA) {
        if (!OBJECT_ID_REGEX.test(row.CATEGORIA)) {
          errorRow.ERRORES.push(
            "El campo CATEGORIA debe ser un ObjectId válido."
          );
        } else {
          const categoryValid = await categoryIsValid(row.CATEGORIA);

          if (!categoryValid)
            errorRow.ERRORES.push("La CATEGORIA indicada no existe");
        }
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

module.exports = validateBlocksExcelFile;
