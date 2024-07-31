const { OBJECT_ID_REGEX } = require("../constants");
const { detailIsValid, categoryIsValid } = require("../validationSchemas/SubNode");
const readExcelFile = require("./readExcelFile");
const generateExcel = require("./generateExcelFile");

async function validateSubNodeExcelFile(file){
  try{
    const jsonData = readExcelFile(file);

    const headers = [
      "NOMBRE",
      "DESCRIPCION",
      "DETALLE",
      "IMAGEN",
      "LATITUD",
      "LONGITUD",
      "CATEGORIA",
      "PISO",
      "AMBIENTE",
      "SUBAMBIENTE",
    ];
    const errors = [];
    let isValid = true;

    for (const row of jsonData) {
      const errorRow = { ...row, ERRORES: []};

      const headerKeys = Object.keys(row);
      const missingHeaders = headers.filter(
        (header) => !headerKeys.includes(header)
      );


      if (missingHeaders.length > 0) {
        errorRow.ERRORES.push(
          `Faltan los siguientes encabezados: ${missingHeaders.join(", ")}`
        );
      }

      if (!row.NOMBRE) {
        console.log(row.NOMBRE);
        errorRow.ERRORES.push(
          "El campo NOMBRE es requerido."
        );
      }

      if (!row.DESCRIPCION) {
        console.log(row.DESCRIPCION);
        errorRow.ERRORES.push(
          "El campo DESCRIPCION es requerido."
        );
      }

      if (!row.DETALLE || !OBJECT_ID_REGEX.test(row.DETALLE)) {
        console.log(row.DETALLE);
        errorRow.ERRORES.push(
          "El campo DETALLE debe ser un ObjectId válido y requerido."
        );
      }else{
        const detailValid = await detailIsValid(row.DETALLE);

        if (!detailValid) errorRow.ERRORES.push("El DETALLE indicado no existe");
      }

      if (row.IMAGEN && !/^https?:\/\/\S+$/.test(row.IMAGEN)) {
        errorRow.ERRORES.push("El campo IMAGEN debe ser una URL válida.");
      }

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

      if (!row.CATEGORIA || !OBJECT_ID_REGEX.test(row.CATEGORIA)) {
        console.log(row.CATEGORIA);
        errorRow.ERRORES.push(
          "El campo CATEGORIA debe ser un ObjectId válido y requerido."
        );
      }else{
        const categoryValid = await categoryIsValid(row.CATEGORIA);

        if (!categoryValid) errorRow.ERRORES.push("La CATEGORIA indicada no existe");
      }

      if (typeof row.PISO !== "number" ||
        row.PISO < 0
      ) {
        console.log(row.PISO);
        errorRow.ERRORES.push(
          "El campo PISO debe ser un número mayor o igual a 0."
        );
      }

      if (typeof row.AMBIENTE !== "number" ||
        row.AMBIENTE < 1
      ) {
        console.log(row.AMBIENTE);
        errorRow.ERRORES.push(
          "El campo AMBIENTE debe ser un número mayor o igual a 1."
        );
      }

      if (row.SUBAMBIENTE) {
        if (typeof row.SUBAMBIENTE !== "number" ||
          row.SUBAMBIENTE < 1
        ) {
          console.log(row.SUBAMBIENTE);
          errorRow.ERRORES.push(
            "El campo SUBAMBIENTE debe ser un número mayor o igual a 1."
          );
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

  }catch (err) {
    console.error("Error al validar el archivo Excel:", err);

    throw new Error("Error al validar el archivo Excel");
  }
}

module.exports = validateSubNodeExcelFile;