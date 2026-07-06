const xlsx = require("xlsx");
const fs = require("fs");

const { fromRoot } = require("../utils/path");

// Excel
const workbook = xlsx.readFile(fromRoot("backend/excel/catalogo.xlsx"));

// Hoja
const sheet = workbook.Sheets["MOSQUITEROS_VENTANA"];

if (!sheet) {
  throw new Error("Hoja MOSQUITEROS_VENTANA no encontrada");
}

// Helpers
function normalizarMedida(medida) {
  if (!medida) return "";

  const [ancho, altoRaw] = medida.toString().trim().split("x");

  const alto = Number(altoRaw);

  if (isNaN(alto)) {
    return medida.toString().trim();
  }

  // Mantener exactamente el formato del JSON actual
  if (alto < 100) {
    return `${ancho}x0,${alto}`;
  }

  return `${ancho}x${alto}`;
}

// Leer datos
const rows = xlsx.utils.sheet_to_json(sheet, {
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
  };
});

// Guardar
fs.writeFileSync(
  fromRoot("backend/generated/productos/mosquiteros.json"),
  JSON.stringify(resultado, null, 2),
);

console.log("✅ Mosquiteros generados");
console.log("📊 Medidas:", Object.keys(resultado.medidas).length);
