const XLSX = require("xlsx");
const fs = require("fs");

const { fromRoot } = require("../utils/path");

// Excel
const workbook = XLSX.readFile(fromRoot("backend/excel/catalogo.xlsx"));

// Hoja
const sheet = workbook.Sheets["PUERTAS_MODENA"];

if (!sheet) {
  throw new Error("Hoja PUERTAS_MODENA no encontrada");
}

// Leer datos
const rows = XLSX.utils.sheet_to_json(sheet, {
  defval: null,
});

// Helper para buscar columnas sin depender del nombre exacto
function get(row, posibles) {
  const keys = Object.keys(row);

  for (const posible of posibles) {
    const key = keys.find(
      (k) => k.toString().trim().toUpperCase() === posible.toUpperCase(),
    );

    if (key) {
      return Math.round(Number(row[key]) || 0);
    }
  }

  return 0;
}

// Resultado
const resultado = {
  linea: "modena",

  modelos: {},

  // Valores fijos
  adicionales: {
    barral_curvo: 16500,
    barral_recto: 16500,
    manija_metalica: 14000,
  },
};

rows.forEach((row) => {
  if (!row.MODELO) return;

  const modelo = row.MODELO.toString().trim().toLowerCase();

  resultado.modelos[modelo] = {
    base: get(row, ["BASE"]),

    vidrios: {
      "3mm": get(row, ["3MM"]),
      "4mm": get(row, ["4MM"]),
      "5mm": get(row, ["5MM"]),
      fantasia: get(row, ["FANTASIA"]),
      esmerilado: get(row, ["ESMERILADO"]),
      "3+3": get(row, ["3+3"]),
    },

    dvh: {
      camara: get(row, ["DVH"]),
    },
  };
});

// Guardar
fs.writeFileSync(
  fromRoot("backend/generated/productos/puertas_modena.json"),
  JSON.stringify(resultado, null, 2),
);

console.log("✅ puertas_modena.json generado correctamente");
console.log("📊 Modelos:", Object.keys(resultado.modelos).length);
