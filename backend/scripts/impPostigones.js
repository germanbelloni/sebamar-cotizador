const XLSX = require("xlsx");
const fs = require("fs");
const { fromRoot } = require("../utils/path");

// CONFIG
const archivo = fromRoot("excel/calculadora.xlsx");
const hojaNombre = "postigones";

// HELPERS
const limpiarTexto = (txt) =>
  txt
    ?.toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();

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

// 🔍 HEADER MÁS SEGURO
const headerIndex = data.findIndex(
  (row) =>
    row[0]?.toString().toLowerCase().includes("medida") && row[1] !== undefined,
);

if (headerIndex === -1) {
  throw new Error("No se encontró encabezado");
}

// RESULTADO
const medidas = {};

// 🔥 DATOS (bloque izquierdo)
for (let i = headerIndex + 1; i < data.length; i++) {
  const row = (data[i] || []).slice(0, 4);

  if (!row[0]) continue;

  const medida = row[0].toString().trim();

  const corredizo = Math.round(toNumber(row[1]));
  const deAbrir = Math.round(toNumber(row[2]));
  const hojas = parseInt(limpiarTexto(row[3])) || 0;

  medidas[medida] = {
    corredizo,
    de_abrir: deAbrir,
    hojas,
  };
}

// OUTPUT
const resultado = { medidas };

fs.writeFileSync(
  fromRoot("frontend/data/productos/postigones.json"),
  JSON.stringify(resultado, null, 2),
);

console.log("✅ postigones.json generado correctamente");
console.log("📊 Medidas:", Object.keys(medidas).length);
