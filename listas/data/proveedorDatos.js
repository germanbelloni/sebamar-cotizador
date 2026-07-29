"use strict";

const path = require("path");
const XLSX = require("xlsx");

const CATALOGO_PATH = path.resolve(
  __dirname,
  "../../backend/excel/catalogo.xlsx",
);

function leerHoja(nombreHoja) {
  const workbook = XLSX.readFile(CATALOGO_PATH, {
    cellDates: false,
    raw: true,
  });
  const sheet = workbook.Sheets[nombreHoja];

  if (!sheet) {
    throw new Error(`No existe la hoja '${nombreHoja}' en catalogo.xlsx.`);
  }

  const rows = XLSX.utils.sheet_to_json(sheet, {
    defval: null,
    raw: true,
  });

  if (!rows.length) {
    throw new Error(`La hoja '${nombreHoja}' no contiene filas.`);
  }

  return rows;
}

function obtenerVentanasHerrero() {
  return leerHoja("VENTANAS_HERRERO");
}

function obtenerSuperficies() {
  return require(path.resolve(__dirname, "../../backend/data/productos/superficies.json"));
}

module.exports = {
  CATALOGO_PATH,
  leerHoja,
  obtenerVentanasHerrero,
  obtenerSuperficies,
};
