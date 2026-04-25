const XLSX = require("xlsx");
const fs = require("fs");
const { fromRoot } = require("../utils/path");

// CONFIG
const archivo = fromRoot("excel/calculadora.xlsx");
const hoja = "puertas herrero";

const workbook = XLSX.readFile(archivo);
const sheet = workbook.Sheets[hoja];

if (!sheet) {
  throw new Error(`No se encontró la hoja: ${hoja}`);
}

// LEER DATA
const data = XLSX.utils.sheet_to_json(sheet, {
  range: 4,
  defval: null,
});

// HELPERS
function normalizar(texto) {
  return texto?.toString().toLowerCase().trim().replace(/\s+/g, " ");
}

function num(valor) {
  const n = Number(valor);
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
  modelos: {},
  ajustes: {
    "70x200": -0.07,
    "80x200": 0,
    "90x200": 0.1,
  },
  adicionales: {},
};

// RECORRER
data.forEach((row) => {
  const modeloOriginal = get(row, ["modelo"]) || get(row, ["empty"]);

  if (!modeloOriginal) return;

  const texto = normalizar(modeloOriginal);

  // ADICIONALES
  if (texto.includes("barral") && texto.includes("curvo")) {
    resultado.adicionales["barral_curvo"] = num(get(row, ["vidrio"]));
    return;
  }

  if (texto.includes("barral") && texto.includes("recto")) {
    resultado.adicionales["barral_recto"] = num(get(row, ["vidrio"]));
    return;
  }

  if (texto.includes("manija")) {
    resultado.adicionales["manija_metalica"] = num(get(row, ["vidrio"]));
    return;
  }

  // MODELOS
  const modelo = texto;

  resultado.modelos[modelo] = {
    base: num(get(row, ["s/vidrio", "sin vidrio"])),

    vidrios: {
      "3mm": num(get(row, ["3mm"])),
      "4mm": num(get(row, ["4mm"])),
      "5mm": num(get(row, ["5mm"])),
      fantasia: num(get(row, ["fantasia"])),
      esmerilado: num(get(row, ["esmerilado"])),
      "3+3": num(get(row, ["3+3"])),
    },
  };

  if (modelo.includes("modelo 5") || modelo.includes("panel")) {
    resultado.modelos[modelo].sinVidrio = true;
  }
});

// OUTPUT
fs.writeFileSync(
  fromRoot("frontend/data/productos/puertas_herrero.json"),
  JSON.stringify(resultado, null, 2),
);

console.log("✅ JSON puertas herrero generado correctamente");
console.log("📊 Modelos:", Object.keys(resultado.modelos).length);
console.log("📊 Adicionales:", Object.keys(resultado.adicionales).length);
