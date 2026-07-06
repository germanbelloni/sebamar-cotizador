const XLSX = require("xlsx");
const fs = require("fs");

const { fromRoot } = require("../utils/path");

// 📂 Excel
const workbook = XLSX.readFile(fromRoot("backend/excel/catalogo.xlsx"));

// 📄 Hoja
const sheet = workbook.Sheets["PATAGONICAS_MODENA"];

if (!sheet) {
  throw new Error("Hoja PATAGONICAS_MODENA no encontrada");
}

// 📊 Leer datos
const rows = XLSX.utils.sheet_to_json(sheet, {
  defval: null,
});

const resultado = {
  tipos: {
    "1_raja": {
      medidas: {},
    },
    "2_rajas": {
      medidas: {},
    },
  },
};

rows.forEach((row) => {
  if (!row.TIPO || !row.MEDIDA) return;

  const tipo =
    row.TIPO.toString().trim().toUpperCase() === "1_RAJA"
      ? "1_raja"
      : "2_rajas";

  resultado.tipos[tipo].medidas[row.MEDIDA.toString().trim()] = {
    base: Math.round(Number(row.BASE) || 0),
    vidrios: {
      "4mm": Math.round(Number(row.VIDRIO_4MM) || 0),
      "3+3": Math.round(Number(row["VIDRIO_3+3"]) || 0),
    },
    camara: Math.round(Number(row.CAMARA) || 0),
  };
});

// 💾 Guardar
fs.writeFileSync(
  fromRoot("backend/generated/productos/patagonicas_modena.json"),
  JSON.stringify(resultado, null, 2),
);

console.log("✅ patagonicas_modena.json generado correctamente");
console.log(
  "📊 1 Raja:",
  Object.keys(resultado.tipos["1_raja"].medidas).length,
);
console.log(
  "📊 2 Rajas:",
  Object.keys(resultado.tipos["2_rajas"].medidas).length,
);
