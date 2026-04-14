const XLSX = require("xlsx");
const fs = require("fs");

// CONFIG
const archivo = "excel/calculadora.xlsx";
const hojaNombre = "patagonicas modena";

// HELPERS
const normalizar = (txt) =>
  txt?.toString().toLowerCase().trim().replace(/\s+/g, "_");

const limpiarHeader = (h) => {
  if (!h) return "";

  h = normalizar(h);

  if (h === "s/vidrio") return "base";
  if (h.includes("camara")) return "camara";

  return h.replace("v/", "").replace("vid/", "");
};

// LEER EXCEL
const workbook = XLSX.readFile(archivo);
const sheet = workbook.Sheets[hojaNombre];

if (!sheet) {
  console.log("❌ No se encontró la hoja:", hojaNombre);
  process.exit(1);
}

const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

// 🔥 headers (fila 6)
const headers = data[5].slice(0, 5).map(limpiarHeader);

// 🔥 función para procesar bloques
function procesarBloque(desde, hasta) {
  const medidas = {};

  for (let i = desde; i <= hasta; i++) {
    const row = data[i].slice(0, 5);

    if (!row[0]) continue;

    const medida = row[0].toString().trim();

    let base = 0;
    let camara = 0;
    const vidrios = {};

    headers.forEach((h, index) => {
      if (index === 0) return;

      const valor = Math.round(Number(row[index]) || 0);

      if (h === "base") {
        base = valor;
        return;
      }

      if (h === "camara") {
        camara = valor;
        return;
      }

      vidrios[h] = valor;
    });

    medidas[medida] = {
      base,
      vidrios,
      camara,
    };
  }

  return medidas;
}

// 🔥 BLOQUES
const unaRaja = procesarBloque(6, 34); // filas 7–35
const dosRajas = procesarBloque(41, 44); // filas 42–45

// OUTPUT
const resultado = {
  tipos: {
    "1_raja": {
      medidas: unaRaja,
    },
    "2_rajas": {
      medidas: dosRajas,
    },
  },
};

fs.writeFileSync(
  "data/productos/patagonicas_modena.json",
  JSON.stringify(resultado, null, 2),
);

console.log("✅ patagonicas_modena.json generado correctamente");
