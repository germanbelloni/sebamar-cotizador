const XLSX = require("xlsx");
const fs = require("fs");

const { fromRoot } = require("../utils/path");

// Excel
const workbook = XLSX.readFile(fromRoot("backend/excel/catalogo.xlsx"));

// Hoja
const sheet = workbook.Sheets["VENTANAS_MODENA"];

if (!sheet) {
  throw new Error("Hoja VENTANAS_MODENA no encontrada");
}

// Helpers
function normalizarMedida(medida) {
  if (!medida) return "";

  const [ancho, altoRaw] = medida.toString().trim().split("x");

  const alto = Number(altoRaw);

  if (isNaN(alto)) {
    return medida.toString().trim();
  }

  if (alto < 100) {
    return `${ancho}x0,${alto}`;
  }

  return `${ancho}x${alto}`;
}

// Leer datos
const rows = XLSX.utils.sheet_to_json(sheet, {
  defval: null,
});
// Resultado
const resultado = {
  medidas: {},
};

rows.forEach((row) => {
  if (!row.MEDIDA) return;

  const medida = normalizarMedida(row.MEDIDA);

  resultado.medidas[medida] = {
    base: Math.round(Number(row.BASE) || 0),
    guia: Math.round(Number(row.GUIA) || 0),
    mosquitero: Math.round(Number(row.MOSQUITERO) || 0),

    vidrios: {
      "3mm": Math.round(Number(row["3MM"]) || 0),
      "4mm": Math.round(Number(row["4MM"]) || 0),
      "5mm": Math.round(Number(row["5MM"]) || 0),
      "3+3": Math.round(Number(row["3+3"]) || 0),
      dvh: Math.round(Number(row.DVH) || 0),
    },
  };
});

// Guardar
fs.writeFileSync(
  fromRoot("backend/generated/productos/ventanas_modena.json"),
  JSON.stringify(resultado, null, 2),
);

console.log("✅ ventanas_modena.json generado correctamente");
console.log("📊 Medidas:", Object.keys(resultado.medidas).length);
