const XLSX = require("xlsx");
const fs = require("fs");
const { fromRoot } = require("../utils/path");

// CONFIG
const archivo = fromRoot("excel/calculadora.xlsx");
const hojaNombre = "placas";

// HELPERS
const limpiar = (txt) => txt?.toString().toLowerCase().trim();

const normalizarModelo = (marco, hoja) => {
  const m = limpiar(marco).replace("marco", "").trim();
  const h = limpiar(hoja).replace("hoja", "").trim();
  return `${m}_${h}`.replace(/\s+/g, "_");
};

const toNumber = (v) => {
  const n = Number(v);
  return isNaN(n) ? 0 : n;
};

// LEER EXCEL
const workbook = XLSX.readFile(archivo);
const sheet = workbook.Sheets[hojaNombre];

if (!sheet) {
  throw new Error(`No se encontró la hoja: ${hojaNombre}`);
}

const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

// RESULTADO
const resultado = {
  placa: {},
  embutir: {},
};

// ESTADO
let tipoActual = "placa";
let modeloActual = null;

// RECORRER
for (let i = 0; i < data.length; i++) {
  const row = data[i] || [];

  const colA = row[0];
  const colB = row[1];
  const colC = row[2];
  const colD = row[3];

  // CAMBIO A EMBUTIR
  if (
    typeof colA === "string" &&
    colA.toLowerCase().includes("puertas embutir")
  ) {
    tipoActual = "embutir";
    modeloActual = null;
    continue;
  }

  // DETECTAR MODELO
  if (typeof colA === "string" && colA.toLowerCase().includes("marco")) {
    const marco = colA;
    const hoja = data[i + 2]?.[0];

    if (!hoja) continue;

    modeloActual = normalizarModelo(marco, hoja);

    if (!resultado[tipoActual][modeloActual]) {
      resultado[tipoActual][modeloActual] = {};
    }

    continue;
  }

  // MEDIDAS
  if (typeof colB === "string" && colB.includes("x")) {
    if (!modeloActual) continue;

    const medida = colB.trim();

    if (!resultado[tipoActual][modeloActual][medida]) {
      resultado[tipoActual][modeloActual][medida] = {};
    }

    if (colD === undefined || colD === "") {
      resultado[tipoActual][modeloActual][medida]["aluminio"] = toNumber(colC);
    } else {
      resultado[tipoActual][modeloActual][medida]["marco_10"] = toNumber(colC);

      resultado[tipoActual][modeloActual][medida]["marco_15"] = toNumber(colD);
    }

    if (tipoActual === "embutir") {
      const val = toNumber(colD);

      resultado[tipoActual][modeloActual][medida]["marco_10"] = val;
      resultado[tipoActual][modeloActual][medida]["marco_15"] = val;
    }
  }
}

// GUARDAR
fs.writeFileSync(
  fromRoot("frontend/data/productos/puertas_placa.json"),
  JSON.stringify(resultado, null, 2),
);

console.log("✅ JSON PUERTAS PLACA generado correctamente");
console.log("📊 Modelos placa:", Object.keys(resultado.placa).length);
console.log("📊 Modelos embutir:", Object.keys(resultado.embutir).length);
