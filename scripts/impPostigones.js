const XLSX = require("xlsx");
const fs = require("fs");

// CONFIG
const archivo = "excel/calculadora.xlsx";
const hojaNombre = "postigones";

// HELPERS
const normalizar = (txt) =>
  txt?.toString().toLowerCase().trim().replace(/\s+/g, "_");

// LEER EXCEL
const workbook = XLSX.readFile(archivo);
const sheet = workbook.Sheets[hojaNombre];

if (!sheet) {
  console.log("❌ No se encontró la hoja:", hojaNombre);
  process.exit(1);
}

const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

// 🔥 HEADERS (fila 7 → index 6)
const headers = data[6].slice(0, 4).map(normalizar);

// RESULTADO
const medidas = {};

// 🔥 DATOS (fila 8 → index 7)
for (let i = 7; i < data.length; i++) {
  const row = data[i].slice(0, 4);

  if (!row[0]) continue;

  const medida = row[0].toString().trim();

  const corredizo = Math.round(Number(row[1]) || 0);
  const deAbrir = Math.round(Number(row[2]) || 0);
  let hojas = row[3]?.toString().trim() || "";

  // 🔥 limpieza visual
  hojas = hojas.replace("ó", "o");

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
  "data/productos/postigones.json",
  JSON.stringify(resultado, null, 2),
);

console.log("✅ postigones.json generado correctamente");
