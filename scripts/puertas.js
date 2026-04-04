const XLSX = require("xlsx");
const fs = require("fs");

const archivo = "excel/calculadora.xlsx";
const hoja = "puertas herrero"; // 👈 EXACTO como dijiste

const workbook = XLSX.readFile(archivo);
const sheet = workbook.Sheets[hoja];

if (!sheet) {
  console.log("❌ No se encontró la hoja:", hoja);
  process.exit(1);
}
const data = XLSX.utils.sheet_to_json(sheet, {
  range: 4 // 👈 fila 5 (empieza en 0)
});

const resultado = {
  modelos: {},
  ajustes: {
    "70x200": -0.07,
    "80x200": 0,
    "90x200": 0.10
  },
  adicionales: {
    "Barral curvo": 15000,
    "Barral recto": 12000
  }
};

data.forEach(row => {

  const modelo = row["__EMPTY"];

  if (!modelo) return;

  resultado.modelos[modelo] = {
    base: row["s/vidrio"] || 0,
    vidrios: {
      "3mm": row["v/3mm"] || 0,
      "4mm": row["v/4mm"] || 0,
      "5mm": row["v/5mm"] || 0,
      "fantasia": row["v/fantasia"] || 0,
      "esmerilado": row["v/esmerilado"] || 0,
      "3+3": row["V3+3"] || 0
    }
  };

  // 🔥 modelos sin vidrio
  if (modelo === "Modelo 5" || modelo === "Modelo Panel") {
    resultado.modelos[modelo].sinVidrio = true;
  }

});

fs.writeFileSync(
  "data/productos/puertas_herrero.json",
  JSON.stringify(resultado, null, 2)
);
console.log(data[0]);

console.log("✅ JSON puertas herrero generado");