const XLSX = require("xlsx");
const fs = require("fs");
const { fromRoot } = require("../utils/path");

// CONFIG
const archivo = fromRoot("excel/calculadora.xlsx");
const hoja = "medias puertas herrero";

const workbook = XLSX.readFile(archivo);
const sheet = workbook.Sheets[hoja];

if (!sheet) {
  throw new Error(`No se encontró la hoja: ${hoja}`);
}

// LEER DATA
const data = XLSX.utils.sheet_to_json(sheet, {
  range: 5,
  defval: null,
});

// HELPERS
function normalizar(texto) {
  return texto?.toString().toLowerCase().trim().replace(/\s+/g, " ");
}

function num(v) {
  const n = Number(v);
  return isNaN(n) ? 0 : n;
}

function get(row, posibles) {
  for (let key in row) {
    const k = normalizar(key);
    if (posibles.some((p) => k.includes(p))) {
      return row[key];
    }
  }
  return 0;
}

// RESULTADO
const resultado = {
  medias: {},
};

data.forEach((row) => {
  const modeloOriginal = get(row, ["modelo"]) || get(row, ["empty"]);

  if (!modeloOriginal) return;

  const modelo = normalizar(modeloOriginal);

  resultado.medias[modelo] = {
    base: num(get(row, ["s/vidrio", "sin vidrio"])),

    vidrios: {
      "4mm": num(get(row, ["4mm"])),
      "3+3": num(get(row, ["3+3"])),
      fantasia: num(get(row, ["fantasia"])),
      esmerilado: num(get(row, ["esmerilado"])),
    },
  };
});

// OUTPUT
fs.writeFileSync(
  fromRoot("frontend/data/productos/puertas_media_herrero.json"),
  JSON.stringify(resultado, null, 2),
);

console.log("✅ JSON puertas MEDIA generado");
console.log("📊 Modelos:", Object.keys(resultado.medias).length);
