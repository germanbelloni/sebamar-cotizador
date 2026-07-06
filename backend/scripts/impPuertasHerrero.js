const XLSX = require("xlsx");
const fs = require("fs");

const { fromRoot } = require("../utils/path");

// Excel
const workbook = XLSX.readFile(fromRoot("backend/excel/catalogo.xlsx"));

// Hoja
const sheet = workbook.Sheets["PUERTAS_HERRERO"];

if (!sheet) {
  throw new Error("Hoja PUERTAS_HERRERO no encontrada");
}

// Leer datos
const rows = XLSX.utils.sheet_to_json(sheet, {
  defval: null,
});

// Resultado
const resultado = {
  modelos: {},

  ajustes: {
    "70x200": -0.07,
    "80x200": 0,
    "90x200": 0.1,
  },

  // Valores fijos.
  adicionales: {
    barral_curvo: 18000,
    barral_recto: 18000,
  },
};

rows.forEach((row) => {
  if (!row.MODELO) return;

  const modelo = row.MODELO.toString().trim().toLowerCase();

  resultado.modelos[modelo] = {
    base: Math.round(Number(row.BASE) || 0),

    vidrios: {
      "3mm": Math.round(Number(row["3MM"]) || 0),
      "4mm": Math.round(Number(row["4MM"]) || 0),
      "5mm": Math.round(Number(row["5MM"]) || 0),
      fantasia: Math.round(Number(row.FANTASIA) || 0),
      esmerilado: Math.round(Number(row.ESMERILADO) || 0),
      "3+3": Math.round(Number(row["3+3"]) || 0),
    },
  };

  if (modelo === "modelo 5" || modelo.includes("panel")) {
    resultado.modelos[modelo].sinVidrio = true;
  }
});

// Guardar
fs.writeFileSync(
  fromRoot("backend/generated/productos/puertas_herrero.json"),
  JSON.stringify(resultado, null, 2),
);

console.log("✅ puertas_herrero.json generado correctamente");
console.log("📊 Modelos:", Object.keys(resultado.modelos).length);
