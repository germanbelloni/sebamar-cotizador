const XLSX = require("xlsx");
const fs = require("fs");

const { fromRoot } = require("../utils/path");

// 📂 Excel
const workbook = XLSX.readFile(fromRoot("backend/excel/catalogo.xlsx"));

// 📄 Hoja
const sheet = workbook.Sheets["POSTIGONES"];

if (!sheet) {
  throw new Error("Hoja POSTIGONES no encontrada");
}

// 📊 Leer datos
const rows = XLSX.utils.sheet_to_json(sheet, {
  defval: null,
});

const resultado = {
  medidas: {},
};

rows.forEach((row) => {
  if (!row.MEDIDA) return;

  resultado.medidas[row.MEDIDA.toString().trim()] = {
    corredizo: Math.round(Number(row.CORREDIZO) || 0),
    de_abrir: Math.round(Number(row.DE_ABRIR) || 0),
    hojas: Math.round(Number(row.HOJAS) || 0),
  };
});

// 💾 Guardar
fs.writeFileSync(
  fromRoot("backend/generated/productos/postigones.json"),
  JSON.stringify(resultado, null, 2),
);

console.log("✅ postigones.json generado correctamente");
console.log("📊 Medidas:", Object.keys(resultado.medidas).length);
