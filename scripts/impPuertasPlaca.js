const XLSX = require("xlsx");
const fs = require("fs");

// CONFIG
const archivo = "excel/calculadora.xlsx";
const hojaNombre = "placas";

// HELPERS
const limpiar = (txt) => txt?.toLowerCase().trim();

const normalizarModelo = (marco, hoja) => {
  const m = limpiar(marco).replace("marco", "").trim();
  const h = limpiar(hoja).replace("hoja", "").trim();
  return `${m}_${h}`.replace(/\s+/g, "_");
};

// LEER EXCEL
const workbook = XLSX.readFile(archivo);
const sheet = workbook.Sheets[hojaNombre];

if (!sheet) {
  console.log("❌ No se encontró la hoja:", hojaNombre);
  process.exit(1);
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
  const row = data[i];

  const colA = row[0];
  const colB = row[1];
  const colC = row[2];
  const colD = row[3];

  // 🔥 CAMBIO A EMBUTIR
  if (
    typeof colA === "string" &&
    colA.toLowerCase().includes("puertas embutir")
  ) {
    tipoActual = "embutir";
    continue;
  }

  // 🔥 DETECTAR MODELO (MARCO + HOJA)
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

  // 🔥 MEDIDAS
  if (typeof colB === "string" && colB.includes("x")) {
    if (!modeloActual) continue;

    const medida = colB.trim();

    if (!resultado[tipoActual][modeloActual][medida]) {
      resultado[tipoActual][modeloActual][medida] = {};
    }

    // 🔹 CASO ALUMINIO (sin marco 10/15)
    if (colD === undefined || colD === "") {
      resultado[tipoActual][modeloActual][medida]["aluminio"] =
        Number(colC) || 0;
    } else {
      // 🔹 CASO NORMAL
      resultado[tipoActual][modeloActual][medida]["marco_10"] =
        Number(colC) || 0;

      resultado[tipoActual][modeloActual][medida]["marco_15"] =
        Number(colD) || 0;
    }

    // 🔥 EMBUTIR → mismo valor para ambos
    if (tipoActual === "embutir") {
      const val = Number(colD) || 0;

      resultado[tipoActual][modeloActual][medida]["marco_10"] = val;
      resultado[tipoActual][modeloActual][medida]["marco_15"] = val;
    }
  }
}

// GUARDAR
fs.writeFileSync(
  "data/productos/puertas_placas.json",
  JSON.stringify(resultado, null, 2),
);

console.log("✅ JSON PUERTAS PLACA generado correctamente");
