const XLSX = require("xlsx");
const fs = require("fs");

const { fromRoot } = require("../utils/path");

// CONFIG
const archivo = fromRoot("backend/excel/calculadora.xlsx");
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
  if (v === undefined || v === null || v === "") {
    return 0;
  }

  // SOPORTA:
  // 0,60
  // 0.60
  // 60
  const normalized = v.toString().replace(",", ".");

  const n = Number(normalized);

  return isNaN(n) ? 0 : n;
};

// 🔥 NORMALIZA MEDIDA
// EJEMPLOS:
// 100x0,60 -> 100x60
// 120x0.90 -> 120x90
// 150x100 -> 150x100
function normalizarMedida(valor) {
  if (!valor) {
    return "";
  }

  const raw = valor.toString().trim().toLowerCase();

  const [anchoRaw, altoRaw] = raw.split("x");

  const ancho = Math.round(toNumber(anchoRaw));

  let alto = toNumber(altoRaw);

  // SI VIENE EN METROS (0.60)
  // PASAR A CENTIMETROS
  if (alto > 0 && alto < 10) {
    alto = alto * 100;
  }

  alto = Math.round(alto);

  return `${ancho}x${alto}`;
}

// LEER EXCEL
const workbook = XLSX.readFile(archivo);

const sheet = workbook.Sheets[hojaNombre];

if (!sheet) {
  throw new Error(`No se encontró la hoja: ${hojaNombre}`);
}

const data = XLSX.utils.sheet_to_json(sheet, {
  header: 1,
});

// 🔍 HEADER
const headerIndex = data.findIndex(
  (row) =>
    row[0]?.toString().toLowerCase().includes("medida") && row[1] !== undefined,
);

if (headerIndex === -1) {
  throw new Error("No se encontró encabezado");
}

// RESULTADO
const medidas = {};

// DATOS
for (let i = headerIndex + 1; i < data.length; i++) {
  const row = (data[i] || []).slice(0, 4);

  if (!row[0]) {
    continue;
  }

  // 🔥 MEDIDA NORMALIZADA
  const medida = normalizarMedida(row[0]);

  if (!medida) {
    continue;
  }

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
const resultado = {
  medidas,
};

fs.writeFileSync(
  fromRoot("backend/data/productos/postigones.json"),
  JSON.stringify(resultado, null, 2),
);

console.log("✅ postigones.json generado correctamente");

console.log("📊 Medidas:", Object.keys(medidas).length);
