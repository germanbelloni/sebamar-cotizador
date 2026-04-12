const XLSX = require("xlsx");
const fs = require("fs");

// CONFIG
const archivo = "excel/calculadora.xlsx";
const hojaNombre = "ventana herrero";

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

// 🔥 ENCABEZADOS (fila 6 → index 5)
const headers = data[5].slice(0, 5).map(normalizar);

// RESULTADO
const medidas = {};

// 🔥 DATOS (desde fila 7 → index 6)
for (let i = 6; i < data.length; i++) {
  const row = data[i].slice(0, 5);

  if (!row[0]) continue;

  const medida = row[0].toString().trim();

  const obj = {};

  headers.forEach((hOriginal, index) => {
    if (index === 0) return;

    let h = hOriginal;

    // 🔥 MAPEO CLAVE
    if (h === "sin_vidrio") h = "base";

    obj[h] = Math.round(Number(row[index]) || 0);
  });

  medidas[medida] = obj;
}

// OUTPUT
const resultado = {
  medidas,
};

fs.writeFileSync(
  "data/productos/ventanas_herrero.json",
  JSON.stringify(resultado, null, 2),
);

console.log("✅ ventanas_herrero.json generado correctamente");
