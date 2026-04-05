const XLSX = require("xlsx");
const fs = require("fs");

const archivo = "excel/calculadora.xlsx";
const hoja = "puertas herrero";

const workbook = XLSX.readFile(archivo);
const sheet = workbook.Sheets[hoja];

if (!sheet) {
  console.log("❌ No se encontró la hoja:", hoja);
  process.exit(1);
}

const data = XLSX.utils.sheet_to_json(sheet, {
  range: 4
});

// 🔥 función clave: limpia nombres
function normalizar(texto) {
  return String(texto)
    .toLowerCase()
    .trim()
    .replace(/\s+/g, " ");
}

// 🔥 asegura número
function num(valor) {
  const n = Number(valor);
  return isNaN(n) ? 0 : n;
}

const resultado = {
  modelos: {},
  ajustes: {
    "70x200": -0.07,
    "80x200": 0,
    "90x200": 0.10
  },
  adicionales: {
    "barral_curvo": 15000,
    "barral_recto": 12000
  }
};

data.forEach(row => {

  let modeloOriginal = row["__EMPTY"];
  if (!modeloOriginal) return;

  const modelo = normalizar(modeloOriginal);

  resultado.modelos[modelo] = {
    base: num(row["s/vidrio"]),
    vidrios: {
      "3mm": num(row["v/3mm"]),
      "4mm": num(row["v/4mm"]),
      "5mm": num(row["v/5mm"]),
      "fantasia": num(row["v/fantasia"]),
      "esmerilado": num(row["v/esmerilado"]),
      "3+3": num(row["V3+3"])
    }
  };

  // modelos sin vidrio
  if (modelo.includes("modelo 5") || modelo.includes("panel")) {
    resultado.modelos[modelo].sinVidrio = true;
  }

});

fs.writeFileSync(
  "data/productos/puertas_herrero.json",
  JSON.stringify(resultado, null, 2)
);

console.log("✅ JSON puertas herrero generado correctamente");