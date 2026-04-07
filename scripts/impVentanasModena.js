const xlsx = require("xlsx");
const fs = require("fs");

console.log("ARRANCÓ SCRIPT");

// 📂 archivo
const workbook = xlsx.readFile("../excel/calculadora.xlsx");

const CONFIG = {
  hoja: "ventanas modena",
  salida: "../data/productos/ventanas_modena.json",

  detectarHeaderPor: ["medidas"],

  columnas: {
    medida: ["medidas", "medida"],
    base: ["sin vidrio"],
    guia: ["guia"],
    mosq: ["mosq", "mosquitero"],
  },

  vidrios: {
    "3mm": ["3mm"],
    "4mm": ["4mm"],
    "5mm": ["5mm"],
    "3+3": ["3+3"],
    dvh: ["dvh"],
  },
};

const sheet = workbook.Sheets[CONFIG.hoja];

// 👉 leer TODA la hoja como matriz
const raw = xlsx.utils.sheet_to_json(sheet, { header: 1 });

let headerIndex = raw.findIndex((row) =>
  row.some((cell) => {
    if (!cell) return false;
    const texto = cell.toString().toLowerCase();

    return CONFIG.detectarHeaderPor.some((palabra) => texto.includes(palabra));
  }),
);

if (headerIndex === -1) {
  console.log("❌ No se encontró encabezado");
  process.exit();
}

console.log("Header encontrado en fila:", headerIndex);

// 👉 headers reales
const headers = raw[headerIndex].map((h) =>
  h ? h.toString().toLowerCase().trim() : "",
);

// 👉 datos
const filas = raw.slice(headerIndex + 1);

// 🔧 helper flexible
function get(row, posiblesNombres) {
  for (let nombre of posiblesNombres) {
    const idx = headers.findIndex((h) => h.includes(nombre));
    if (idx !== -1) return row[idx] || 0;
  }
  return 0;
}

let resultado = {
  medidas: {},
};

filas.forEach((row) => {
  const medida = get(row, CONFIG.columnas.medida);
  if (!medida) return;

  resultado.medidas[medida.toString().trim()] = {
    base: get(row, CONFIG.columnas.base),
    guia: get(row, CONFIG.columnas.guia),
    mosquitero: get(row, CONFIG.columnas.mosq),

    vidrios: {
      "3mm": get(row, CONFIG.vidrios["3mm"]),
      "4mm": get(row, CONFIG.vidrios["4mm"]),
      "5mm": get(row, CONFIG.vidrios["5mm"]),
      "3+3": get(row, CONFIG.vidrios["3+3"]),
      dvh: get(row, CONFIG.vidrios["dvh"]),
    },
  };
});

// 💾 guardar
fs.writeFileSync(CONFIG.salida, JSON.stringify(resultado, null, 2));

console.log("✅ JSON generado correctamente");
