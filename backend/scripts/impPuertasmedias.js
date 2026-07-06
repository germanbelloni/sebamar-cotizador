const XLSX = require("xlsx");
const fs = require("fs");

const { fromRoot } = require("../utils/path");

// 📂 Excel
const workbook = XLSX.readFile(fromRoot("backend/excel/catalogo.xlsx"));

// 📄 Hoja
const sheet = workbook.Sheets["MEDIA_PUERTA_HERRERO"];

if (!sheet) {
  throw new Error("Hoja MEDIA_PUERTA no encontrada");
}

// 📊 Leer datos
const rows = XLSX.utils.sheet_to_json(sheet, {
  defval: null,
});

// Resultado
const resultado = {
  medias: {},
};

rows.forEach((row) => {
  if (!row.MODELO) return;

  const modelo = row.MODELO.toString().trim().toLowerCase();

  resultado.medias[modelo] = {
    base: Math.round(Number(row.BASE) || 0),

    vidrios: {
      "4mm": Math.round(Number(row["4MM"]) || 0),
      "3+3": Math.round(Number(row["3+3"]) || 0),
      fantasia: Math.round(Number(row.FANTASIA) || 0),
      esmerilado: Math.round(Number(row.ESMERILADO) || 0),
    },
  };
});

// 💾 Guardar
fs.writeFileSync(
  fromRoot("backend/generated/productos/puertas_media_herrero.json"),
  JSON.stringify(resultado, null, 2),
);

console.log("✅ puertas_media_herrero.json generado correctamente");
console.log("📊 Modelos:", Object.keys(resultado.medias).length);
