const XLSX = require("xlsx");
const fs = require("fs");
const { fromRoot } = require("../utils/path");

// CONFIG
const archivo = fromRoot("excel/calculadora.xlsx");
const hojaNombre = "ventana herrero";

// HELPERS
const normalizar = (txt) =>
  txt?.toString().toLowerCase().trim().replace(/\s+/g, "_");

const toNumber = (v) => {
  const n = Number(v);
  return isNaN(n) ? 0 : n;
};

// LEER EXCEL
const workbook = XLSX.readFile(archivo);
const sheet = workbook.Sheets[hojaNombre];

if (!sheet) {
  throw new Error(`No se encontró la hoja: ${hojaNombre}`);
}

const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

// HEADER
const headerIndex = data.findIndex(
  (row) =>
    row[0]?.toString().toLowerCase().includes("medida") && row[1] !== undefined,
);

if (headerIndex === -1) {
  throw new Error("No se encontró encabezado válido");
}

const headers = data[headerIndex].slice(0, 5).map(normalizar);

// RESULTADO
const medidas = {};

for (let i = headerIndex + 1; i < data.length; i++) {
  const row = (data[i] || []).slice(0, 5);

  if (!row[0]) continue;

  const medida = row[0].toString().trim();

  const obj = {};

  headers.forEach((hOriginal, index) => {
    if (index === 0) return;

    let h = hOriginal;

    if (h === "sin_vidrio") h = "base";

    const valor = Math.round(toNumber(row[index]));

    if (!h) return;

    obj[h] = valor;
  });

  medidas[medida] = obj;
}

// OUTPUT
const resultado = { medidas };

fs.writeFileSync(
  fromRoot("frontend/data/productos/ventanas_herrero.json"),
  JSON.stringify(resultado, null, 2),
);

console.log("✅ ventanas_herrero.json generado correctamente");
console.log("📊 Medidas procesadas:", Object.keys(medidas).length);
