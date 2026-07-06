const XLSX = require("xlsx");
const fs = require("fs");

const { fromRoot } = require("../utils/path");

// 📂 Excel
const workbook = XLSX.readFile(fromRoot("backend/excel/catalogo.xlsx"));

// 📄 Hoja
const sheet = workbook.Sheets["PUERTAS_ECO"];

if (!sheet) {
  throw new Error("Hoja PUERTAS_ECO no encontrada");
}

// 📊 Leer datos
const rows = XLSX.utils.sheet_to_json(sheet, {
  defval: null,
});

// Resultado
const resultado = {
  linea: "eco",
  modelos: {},
};

rows.forEach((row) => {
  if (!row.MODELO) return;

  resultado.modelos[row.MODELO.toString().trim().toLowerCase()] = {
    base: Math.round(Number(row.BASE) || 0),
    vidrios: {
      "3mm": Math.round(Number(row["3MM"]) || 0),
      "4mm": Math.round(Number(row["4MM"]) || 0),
      fantasia: Math.round(Number(row.FANTASIA) || 0),
    },
  };
});

// 💾 Guardar
fs.writeFileSync(
  fromRoot("backend/generated/productos/puertas_eco.json"),
  JSON.stringify(resultado, null, 2),
);

console.log("✅ puertas_eco.json generado correctamente");
console.log("📊 Modelos:", Object.keys(resultado.modelos).length);
