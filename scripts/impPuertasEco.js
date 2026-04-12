const XLSX = require("xlsx");
const fs = require("fs");

// CONFIG
const archivo = "excel/calculadora.xlsx";
const hojaNombre = "puertas eco";

// HELPERS
const normalizarTexto = (txt) => txt?.toLowerCase().trim().replace(/\s+/g, " ");

const normalizarVidrio = (txt) => {
  if (!txt) return "";

  return txt
    .toLowerCase()
    .trim()
    .replace("s/vidrio", "sin_vidrio")
    .replace(/^v(?=\d)/, "") // ✅ solo v antes de número
    .replace(/\s+/g, "");
};

// LEER EXCEL
const workbook = XLSX.readFile(archivo);
const sheet = workbook.Sheets[hojaNombre];

if (!sheet) {
  console.log("❌ No se encontró la hoja:", hojaNombre);
  process.exit(1);
}

const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

// FILA 7 → index 6
const headers = data[6].slice(0, 5);
const columnas = headers.map((h) => normalizarVidrio(h));

// MODELOS
const modelos = {};

for (let i = 7; i < data.length; i++) {
  const row = data[i].slice(0, 5);

  if (!row[0]) continue;

  const nombreModelo = normalizarTexto(row[0]);

  const modeloData = {
    base: 0,
    vidrios: {},
  };

  columnas.forEach((col, index) => {
    if (index === 0) return;

    const valor = Number(row[index]) || 0;

    if (col === "sin_vidrio") {
      modeloData.base = valor;
    } else {
      modeloData.vidrios[col] = valor;
    }
  });

  modelos[nombreModelo] = modeloData;
}

// OUTPUT
const resultado = {
  linea: "eco",
  modelos,
};

fs.writeFileSync(
  "data/productos/puertas_eco.json",
  JSON.stringify(resultado, null, 2),
);

console.log("✅ JSON ECO generado correctamente");
