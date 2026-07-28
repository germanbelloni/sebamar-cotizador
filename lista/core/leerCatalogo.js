const path = require("path");
const XLSX = require("xlsx");

function leerCatalogo() {
  const ruta = path.resolve(__dirname, "../../backend/excel/catalogo.xlsx");

  console.log("📖 Leyendo catálogo...");

  const workbook = XLSX.readFile(ruta);

  return workbook;
}

module.exports = leerCatalogo;
