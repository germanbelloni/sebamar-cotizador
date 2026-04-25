const XLSX = require("xlsx");
const fs = require("fs");
const { fromRoot } = require("../utils/path");

// CONFIG
const archivo = fromRoot("excel/calculadora.xlsx");
const hojaNombre = "rajas herrero";

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

const headers = data[headerIndex].slice(0, 8).map(normalizar);

// RESULTADO
const medidas = {};

for (let i = headerIndex + 1; i < data.length; i++) {
  const row = (data[i] || []).slice(0, 8);

  if (!row[0]) continue;

  const medida = row[0].toString().trim();

  let base = 0;
  const vidrios = {};

  headers.forEach((hOriginal, index) => {
    if (index === 0) return;

    let h = hOriginal;
    const valor = Math.round(toNumber(row[index]));

    if (h === "sin_vidrio" || h === "s/vidrio") {
      base = valor;
      return;
    }

    h = h.replace("vid/", "").replace("v/", "").trim();

    if (!h) return;

    vidrios[h] = valor;
  });

  medidas[medida] = {
    base,
    vidrios,
  };
}

// OUTPUT
const resultado = { medidas };

fs.writeFileSync(
  fromRoot("frontend/data/productos/rajas_herrero.json"),
  JSON.stringify(resultado, null, 2),
);

console.log("✅ rajas_herrero.json generado correctamente");
console.log("📊 Medidas procesadas:", Object.keys(medidas).length);
