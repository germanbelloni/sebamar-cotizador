const XLSX = require("xlsx");
const fs = require("fs");
const { fromRoot } = require("../utils/path");

// CONFIG
const archivo = fromRoot("excel/calculadora.xlsx");
const hojaNombre = "rajas modena";

// HELPERS
const norm = (txt) => txt?.toString().toLowerCase().trim().replace(/\s+/g, " ");

const toNumber = (v) => {
  if (typeof v === "string") v = v.replace(",", ".");
  const n = Number(v);
  return isNaN(n) ? 0 : Math.round(n);
};

// LEER EXCEL
const workbook = XLSX.readFile(archivo);
const sheet = workbook.Sheets[hojaNombre];

if (!sheet) {
  throw new Error(`No se encontró la hoja: ${hojaNombre}`);
}

const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

// 🔍 HEADER REAL (tabla izquierda)
const headerIndex = data.findIndex(
  (row) =>
    row[0]?.toString().toLowerCase().includes("medidas") &&
    row[1]?.toString().toLowerCase().includes("vidrio"),
);

if (headerIndex === -1) {
  throw new Error("No se encontró encabezado de rajas modena");
}

// RESULTADO
const medidas = {};

for (let i = headerIndex + 1; i < data.length; i++) {
  const row = data[i];

  if (!row || !row[0]) continue;

  const medida = row[0].toString().trim();

  // cortar si empieza cualquier bloque raro
  if (!medida.includes("x")) continue;

  medidas[medida] = {
    base: toNumber(row[1]),
    vidrios: {
      "3mm": toNumber(row[2]),
      "4mm": toNumber(row[3]),
      "5mm": toNumber(row[4]),
      esmerilado: toNumber(row[5]),
      fantasia: toNumber(row[6]),
      "3+3": toNumber(row[7]),
    },
    camara: toNumber(row[8]),
  };
}

// OUTPUT
const resultado = {
  medidas,
};

fs.writeFileSync(
  fromRoot("frontend/data/productos/rajas_modena.json"),
  JSON.stringify(resultado, null, 2),
);

console.log("✅ rajas_modena.json generado correctamente");
console.log("📊 Medidas:", Object.keys(medidas).length);
