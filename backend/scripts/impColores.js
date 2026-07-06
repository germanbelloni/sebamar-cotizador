const xlsx = require("xlsx");
const fs = require("fs");

const { fromRoot } = require("../utils/path");

// 📂 Excel
const workbook = xlsx.readFile(fromRoot("backend/excel/catalogo.xlsx"));

// 📄 Hoja
const sheet = workbook.Sheets["COLORES"];

if (!sheet) {
  throw new Error("Hoja COLORES no encontrada en catalogo.xlsx");
}

// 🔧 Helpers
const normalizar = (txt) => txt?.toString().toLowerCase().trim();

const toNumber = (v) => {
  if (typeof v === "string") {
    v = v.replace(",", ".");
  }

  const n = Number(v);
  return isNaN(n) ? 0 : n;
};

// 📋 Leer hoja completa
const filas = xlsx.utils.sheet_to_json(sheet, {
  defval: "",
});

// 🔧 Construir JSON
const colores = filas
  .filter((row) => row.NOMBRE)
  .map((row) => ({
    nombre: normalizar(row.NOMBRE),
    valor: toNumber(row.VALOR),
  }));

// 💾 Guardar
const outputPath = fromRoot("backend/generated/colores.json");

fs.writeFileSync(outputPath, JSON.stringify(colores, null, 2));

console.log("✅ colores generados correctamente");
console.log("🎨 Colores:", colores.length);
