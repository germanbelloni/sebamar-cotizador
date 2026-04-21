const xlsx = require("xlsx");
const fs = require("fs");
const { fromRoot } = require("../utils/path");

// 📂 Excel
const workbook = xlsx.readFile(fromRoot("excel/calculadora.xlsx"));

// 🔍 hoja dinámica
const sheetName = workbook.SheetNames.find((n) =>
  n.toLowerCase().includes("mosquiteros"),
);

if (!sheetName) {
  throw new Error("Hoja mosquiteros no encontrada");
}

const sheet = workbook.Sheets[sheetName];

// 📊 leer crudo
const raw = xlsx.utils.sheet_to_json(sheet, { header: 1 });

// 🔍 encontrar header (fila que tiene "Medidas")
const headerIndex = raw.findIndex((row) =>
  row.some((cell) => cell?.toString().toLowerCase().includes("medidas")),
);

if (headerIndex === -1) {
  throw new Error("No se encontró encabezado");
}

// RESULTADO
const resultado = {
  medidas: {},
};

// 🔥 recorrer filas
for (let i = headerIndex + 1; i < raw.length; i++) {
  const row = raw[i];

  const medida = row[0];
  const precio = row[1];

  if (!medida) continue;

  resultado.medidas[medida.toString().trim()] = {
    base: Math.round(Number(precio) || 0),
  };
}

// 💾 guardar
fs.writeFileSync(
  fromRoot("frontend/data/productos/mosquiteros.json"),
  JSON.stringify(resultado, null, 2),
);

console.log("✅ mosquiteros generados");
console.log("📊 Medidas:", Object.keys(resultado.medidas).length);
