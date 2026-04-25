const XLSX = require("xlsx");
const fs = require("fs");
const { fromRoot } = require("../utils/path");

// CONFIG
const archivo = fromRoot("excel/calculadora.xlsx");
const hojaNombre = "patagonicas modena";

// HELPERS
const normalizar = (txt) =>
  txt?.toString().toLowerCase().trim().replace(/\s+/g, "_");

const limpiarHeader = (h) => {
  if (!h) return "";

  h = normalizar(h);

  if (h.includes("sin") || h.includes("s/vidrio")) return "base";
  if (h.includes("camara")) return "camara";
  if (h.includes("3mm")) return "3mm";
  if (h.includes("4mm")) return "4mm";
  if (h.includes("5mm")) return "5mm";
  if (h.includes("3+3")) return "3+3";

  return "";
};

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
    row[0]?.toString().toLowerCase().includes("medida") &&
    row[1]?.toString().toLowerCase().includes("vidrio"),
);

if (headerIndex === -1) {
  throw new Error("No se encontró encabezado válido");
}

const headers = data[headerIndex].slice(0, 5).map(limpiarHeader);

// PROCESO
function procesar(desde, hasta) {
  const medidas = {};

  for (let i = desde; i <= hasta; i++) {
    const row = (data[i] || []).slice(0, 5);

    // ✅ FILTRO CORRECTO (ADENTRO DEL LOOP)
    if (
      !row[0] ||
      row[0].toString().toLowerCase().includes("medida") ||
      row[0].toString().toLowerCase().includes("modelo")
    ) {
      continue;
    }

    const medida = row[0].toString().trim();

    let base = 0;
    let camara = 0;
    const vidrios = {};

    headers.forEach((h, index) => {
      if (index === 0) return;

      const valor = Math.round(toNumber(row[index]));

      if (h === "base") base = valor;
      else if (h === "camara") camara = valor;
      else if (h) vidrios[h] = valor;
    });

    medidas[medida] = { base, vidrios, camara };
  }

  return medidas;
}

// BLOQUES
const unaRaja = procesar(headerIndex + 1, headerIndex + 30);
const dosRajas = procesar(headerIndex + 35, headerIndex + 38);

// OUTPUT
const resultado = {
  tipos: {
    "1_raja": { medidas: unaRaja },
    "2_rajas": { medidas: dosRajas },
  },
};

fs.writeFileSync(
  fromRoot("frontend/data/productos/patagonicas_modena.json"),
  JSON.stringify(resultado, null, 2),
);

console.log("✅ patagonicas_modena.json generado correctamente");
