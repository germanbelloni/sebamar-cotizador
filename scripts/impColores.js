const xlsx = require("xlsx");
const fs = require("fs");

const { fromRoot } = require("../utils/path");

// 📂 Excel
const workbook = xlsx.readFile(fromRoot("excel/calculadora.xlsx"));

// 📄 hoja CONFIG
const sheet = workbook.Sheets["CONFIG"];

if (!sheet) {
  throw new Error("Hoja CONFIG no encontrada en el Excel");
}

// 🔧 helpers
const normalizar = (txt) => txt?.toString().toLowerCase().trim();

const toNumber = (v) => {
  if (typeof v === "string") {
    v = v.replace(",", ".");
  }
  const n = Number(v);
  return isNaN(n) ? 0 : n;
};

// 🔥 rango
const rango = xlsx.utils.sheet_to_json(sheet, {
  range: "A10:B13",
  header: ["COLOR", "VALOR"],
  defval: null,
});

// 🔧 evitar duplicados
const mapa = {};

rango.forEach((row) => {
  const nombreRaw = row["COLOR"];
  if (!nombreRaw) return;

  const nombre = normalizar(nombreRaw);
  const valor = toNumber(row["VALOR"]);

  mapa[nombre] = {
    nombre,
    valor,
  };
});

// 👉 convertir a array
const colores = Object.values(mapa);

// 💾 guardar
const outputPath = fromRoot("frontend/data/colores.json");

fs.writeFileSync(outputPath, JSON.stringify(colores, null, 2));

console.log("✅ colores generados correctamente");
console.log("🎨 Colores:", colores.length);
