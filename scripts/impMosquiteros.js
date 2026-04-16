const XLSX = require("xlsx");
const fs = require("fs");
const path = require("path");

// 📂 RUTA EXCEL (desde /backend)
const excelPath = path.join(process.cwd(), "../excel/calculadora.xlsx");

// 📖 LEER ARCHIVO
const workbook = XLSX.readFile(excelPath);

// 📄 HOJA
const sheet = workbook.Sheets["mosquiteros"];

if (!sheet) {
  throw new Error("❌ No existe la hoja 'mosquiteros'");
}

// 📊 DATOS (fila 6 en adelante)
const data = XLSX.utils.sheet_to_json(sheet, {
  range: 5,
});

// 🧠 PROCESAR
const resultado = {};

data.forEach((row) => {
  const medida = row["Medidas"];
  const base = Number(row["MOSQUITERO"]) || 0;

  if (!medida) return;

  resultado[medida] = {
    base,
  };
});

// 💾 RUTA OUTPUT (a frontend)
const outputPath = path.join(
  process.cwd(),
  "../frontend/data/productos/mosquiteros.json",
);

// 📁 CREAR CARPETA SI NO EXISTE
fs.mkdirSync(path.dirname(outputPath), { recursive: true });

// 💾 GUARDAR JSON
fs.writeFileSync(outputPath, JSON.stringify({ medidas: resultado }, null, 2));

console.log("✅ Mosquiteros importados correctamente");
