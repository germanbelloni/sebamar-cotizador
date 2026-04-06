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

// Leer desde fila 5 (headers reales)
const data = XLSX.utils.sheet_to_json(sheet, {
  range: 4,
});

// HELPERS
function normalizar(texto) {
  return String(texto).toLowerCase().trim().replace(/\s+/g, " ");
}

function num(valor) {
  const n = Number(valor);
  return isNaN(n) ? 0 : n;
}

const resultado = {
  modelos: {},
  ajustes: {
    "70x200": -0.07,
    "80x200": 0,
    "90x200": 0.1,
  },
  adicionales: {},
};

data.forEach((row) => {
  const modeloOriginal = row["__EMPTY"];
  if (!modeloOriginal) return;

  const modelo = normalizar(modeloOriginal);

  resultado.modelos[modelo] = {
    base: num(row["s/vidrio"]),
    vidrios: {
      "3mm": num(row["v/3mm"]),
      "4mm": num(row["v/4mm"]),
      "5mm": num(row["v/5mm"]),
      fantasia: num(row["v/fantasia"]),
      esmerilado: num(row["v/esmerilado"]),
      "3+3": num(row["v/3+3"] || row["V3+3"]),
    },
  };

  // modelos sin vidrio
  if (modelo.includes("modelo 5") || modelo.includes("panel")) {
    resultado.modelos[modelo].sinVidrio = true;
  }
});
// ADICIONALES DESDE EXCEL
data.forEach((row) => {
  const texto = normalizar(row["__EMPTY"]);

  if (texto === "barral curvo") {
    resultado.adicionales["barral_curvo"] = num(row["s/vidrio"]);
  }

  if (texto === "barral recto") {
    resultado.adicionales["barral_recto"] = num(row["s/vidrio"]);
  }

  if (texto === "manija metalica") {
    resultado.adicionales["manija_metalica"] = num(row["s/vidrio"]);
  }
});
fs.writeFileSync(
  "data/productos/puertas_herrero.json",
  JSON.stringify(resultado, null, 2),
);

console.log("✅ JSON puertas herrero generado correctamente");
