const XLSX = require("xlsx");
const fs = require("fs");
const { fromRoot } = require("../utils/path");

// CONFIG
const archivo = fromRoot("excel/calculadora.xlsx");
const hojaNombre = "puertas eco";

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

// 🔍 HEADER (tabla izquierda)
const headerIndex = data.findIndex(
  (row) =>
    row[1]?.toString().toLowerCase().includes("vidrio") &&
    row[2]?.toString().toLowerCase().includes("3mm"),
);

if (headerIndex === -1) {
  throw new Error("No se encontró encabezado de puertas eco");
}

// RESULTADO
const modelos = {};

for (let i = headerIndex + 1; i < data.length; i++) {
  const row = data[i];

  if (!row || !row[0]) continue;

  const texto = norm(row[0]);

  // cortar si aparece algo raro abajo
  if (!texto.includes("modelo")) continue;

  const modelo = texto;

  modelos[modelo] = {
    base: toNumber(row[1]),
    vidrios: {
      "3mm": toNumber(row[2]),
      "4mm": toNumber(row[3]),
      fantasia: toNumber(row[4]),
    },
  };
}

// OUTPUT
const resultado = {
  linea: "eco",
  modelos,
};

fs.writeFileSync(
  fromRoot("frontend/data/productos/puertas_eco.json"),
  JSON.stringify(resultado, null, 2),
);

console.log("✅ puertas_eco.json generado correctamente");
console.log("📊 Modelos:", Object.keys(modelos).length);
