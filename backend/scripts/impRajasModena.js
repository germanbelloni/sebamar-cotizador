const XLSX = require("xlsx");
const fs = require("fs");

const { fromRoot } = require("../utils/path");

// 📂 Excel
const workbook = XLSX.readFile(fromRoot("backend/excel/catalogo.xlsx"));

// 📄 Hoja
const sheet = workbook.Sheets["RAJAS_MODENA"];

if (!sheet) {
  throw new Error("Hoja RAJAS_MODENA no encontrada");
}

// 📊 Leer datos
const rows = XLSX.utils.sheet_to_json(sheet, {
  defval: null,
});

// Resultado
const resultado = {
  medidas: {},
};

rows.forEach((row) => {
  if (!row.MEDIDA) return;

  const medida = row.MEDIDA.toString().trim();

  resultado.medidas[medida] = {
    base: Math.round(Number(row.BASE) || 0),

    vidrios: {
      "3mm": Math.round(Number(row["3MM"]) || 0),
      "4mm": Math.round(Number(row["4MM"]) || 0),
      "5mm": Math.round(Number(row["5MM"]) || 0),
      esmerilado: Math.round(Number(row.ESMERILADO) || 0),
      fantasia: Math.round(Number(row.FANTASIA) || 0),
      "3+3": Math.round(Number(row["3+3"]) || 0),
    },

    camara: Math.round(Number(row.CAMARA) || 0),
  };
});

// 💾 Guardar
fs.writeFileSync(
  fromRoot("backend/generated/productos/rajas_modena.json"),
  JSON.stringify(resultado, null, 2),
);

console.log("✅ rajas_modena.json generado correctamente");
console.log("📊 Medidas:", Object.keys(resultado.medidas).length);
