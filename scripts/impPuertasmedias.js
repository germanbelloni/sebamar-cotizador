const XLSX = require("xlsx");
const fs = require("fs");

const archivo = "excel/calculadora.xlsx";
const hoja = "medias puertas herrero";

const workbook = XLSX.readFile(archivo);
const sheet = workbook.Sheets[hoja];

if (!sheet) {
  console.log("❌ No se encontró la hoja:", hoja);
  process.exit(1);
}

const data = XLSX.utils.sheet_to_json(sheet, {
  range: 5
});

function normalizar(texto) {
  return String(texto).toLowerCase().trim().replace(/\s+/g, " ");
}

function num(v) {
  const n = Number(v);
  return isNaN(n) ? 0 : n;
}

const resultado = {
  medias: {}
};

data.forEach(row => {

  const modeloOriginal = row["modelo"] || row["__EMPTY"]; // 👈 CLAVE
  if (!modeloOriginal) return;

  const modelo = normalizar(modeloOriginal);

  resultado.medias[modelo] = {
    base: num(row["s/vidrio"]),
    vidrios: {
      "4mm": num(row["v4mm"]),
      "3+3": num(row["V3+3"]),
      fantasia: num(row["fantasia"]),
      esmerilado: num(row["esmerilado"])
    }
  };

});

fs.writeFileSync(
  "data/productos/puertas_media_herrero.json",
  JSON.stringify(resultado, null, 2)
);

console.log("✅ JSON puertas MEDIA generado");