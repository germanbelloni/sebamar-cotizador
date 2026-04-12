const XLSX = require("xlsx");
const fs = require("fs");

// CONFIG
const archivo = "excel/calculadora.xlsx";
const hojaNombre = "rajas modena";

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

// 🔥 HEADERS (fila 6)
const headers = data[5].slice(0, 9).map(normalizar);

// RESULTADO
const medidas = {};

// 🔥 DATOS (fila 7)
for (let i = 6; i < data.length; i++) {
  const row = data[i].slice(0, 9);

  if (!row[0]) continue;

  const medida = row[0].toString().trim();

  let base = 0;
  let camara = 0;
  const vidrios = {};

  headers.forEach((hOriginal, index) => {
    if (index === 0) return;

    let h = hOriginal;
    const valor = Math.round(Number(row[index]) || 0);

    // 🔥 BASE
    if (h === "s/vidrio" || h === "sin_vidrio") {
      base = valor;
      return;
    }

    // 🔥 CAMARA DVH
    if (h.includes("camara")) {
      camara = valor;
      return;
    }

    // 🔥 NORMALIZACIONES
    h = h.replace("vid/", "").replace("v/", "");

    vidrios[h] = valor;
  });

  medidas[medida] = {
    base,
    vidrios,
    camara,
  };
}

// OUTPUT
const resultado = {
  medidas,
};

fs.writeFileSync(
  "data/productos/rajas_modena.json",
  JSON.stringify(resultado, null, 2),
);

console.log("✅ rajas_modena.json generado correctamente");
