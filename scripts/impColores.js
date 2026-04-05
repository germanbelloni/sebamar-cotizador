const xlsx = require("xlsx");
const fs = require("fs");

// 📂 leer excel
const workbook = xlsx.readFile("../excel/calculadora.xlsx");

// 📄 hoja CONFIG
const sheet = workbook.Sheets["CONFIG"];

// 🔥 leer SOLO A9:B13
const rango = xlsx.utils.sheet_to_json(sheet, {
  range: "A10:B13",
  header: ["COLOR", "VALOR"]
});

let colores = [];

rango.forEach(row => {

  let nombre = row["COLOR"];
  let valor = row["VALOR"];

  if (!nombre) return;

  // convertir coma a punto
  if (typeof valor === "string") {
    valor = valor.replace(",", ".");
    valor = parseFloat(valor);
  }

  colores.push({
    nombre: nombre.trim(),
    valor: valor || 0
  });

});

// 💾 guardar JSON
fs.writeFileSync(
  "../data/colores.json",
  JSON.stringify(colores, null, 2)
);

console.log("✅ colores limpios generados");