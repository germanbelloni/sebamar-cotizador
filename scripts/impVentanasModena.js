const xlsx = require("xlsx");
const fs = require("fs");
const { fromRoot } = require("../utils/path");

const archivo = fromRoot("excel/calculadora.xlsx");
const workbook = xlsx.readFile(archivo);

const CONFIG = {
  hoja: "ventanas modena",

  detectarHeaderPor: ["medida"],

  columnas: {
    medida: ["medida", "medidas"],
    base: ["sin vidrio", "s/vidrio"],
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

if (!sheet) {
  throw new Error(`Hoja "${CONFIG.hoja}" no encontrada`);
}

const raw = xlsx.utils.sheet_to_json(sheet, { header: 1 });

// HEADER
const headerIndex = raw.findIndex((row) =>
  row.some((cell) =>
    CONFIG.detectarHeaderPor.some((p) =>
      cell?.toString().toLowerCase().includes(p),
    ),
  ),
);

if (headerIndex === -1) {
  throw new Error("No se encontró encabezado");
}

const headers = raw[headerIndex].map((h) =>
  h ? h.toString().toLowerCase().trim() : "",
);

// DATA
const filas = raw.slice(headerIndex + 1);

// HELPERS
function get(row, posibles) {
  for (let nombre of posibles) {
    const idx = headers.findIndex((h) => h.includes(nombre));
    if (idx !== -1) {
      const v = Number(row[idx]);
      return isNaN(v) ? 0 : Math.round(v);
    }
  }
  return 0;
}

// RESULTADO
const resultado = { medidas: {} };

filas.forEach((row) => {
  function getText(row, posibles) {
    for (let nombre of posibles) {
      const idx = headers.findIndex((h) => h.includes(nombre));
      if (idx !== -1) return (row[idx] || "").toString().trim();
    }
    return "";
  }

  const medida = getText(row, CONFIG.columnas.medida);
  if (!medida) return;

  const key = medida.toString().trim();

  resultado.medidas[key] = {
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

// OUTPUT
fs.writeFileSync(
  fromRoot("frontend/data/productos/ventanas_modena.json"),
  JSON.stringify(resultado, null, 2),
);

console.log("✅ ventanas_modena.json generado correctamente");
console.log("📊 Medidas:", Object.keys(resultado.medidas).length);
