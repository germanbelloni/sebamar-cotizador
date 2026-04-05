const XLSX = require("xlsx");
const fs = require("fs");

// CONFIG
const archivo = "excel/calculadora.xlsx";
const hojaNombre = "puertas modena";

// HELPERS
const normalizarTexto = (txt) =>
  txt.toLowerCase().trim().replace(/\s+/g, " ");

const normalizarVidrio = (txt) => {
  return txt
    .toLowerCase()
    .replace("v/", "")
    .replace("mm", "")
    .replace(" ", "")
    .replace("+", "+")
    .replace("camara", "dvh")
    .replace("s/vidrio", "sin_vidrio");
};

// LEER EXCEL
const workbook = XLSX.readFile(archivo);
const sheet = workbook.Sheets[hojaNombre];

// Leer como array
const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

// Encabezados en fila 6 (index 5)
const headers = data[5];

// Mapear columnas
const columnas = headers.map((h) => normalizarVidrio(h));

// Datos desde fila 7
const modelos = {};

for (let i = 6; i < data.length; i++) {
  const row = data[i];

  if (!row[0]) continue;

  const nombreModelo = normalizarTexto(row[0]);

  // cortar cuando llega a ADICIONALES
  if (nombreModelo.includes("adicionales")) break;

  const modeloData = {
    base: 0,
    vidrios: {},
    dvh: { camara: 0 }
  };

  columnas.forEach((col, index) => {
    const valor = Number(row[index]) || 0;

    if (index === 0) return;

    if (col === "sin_vidrio") {
      modeloData.base = valor;
    } else if (col === "dvh") {
      modeloData.dvh.camara = valor;
    } else {
      modeloData.vidrios[col] = valor;
    }
  });

  modelos[nombreModelo] = modeloData;
}

// ADICIONALES (buscamos abajo)
const adicionales = {};

for (let i = 0; i < data.length; i++) {
  const row = data[i];
  if (!row[0]) continue;

  const texto = normalizarTexto(row[0]);

  if (texto === "barral curvo") {
    adicionales["barral_curvo"] = Number(row[1]) || 0;
  }

  if (texto === "barral recto") {
    adicionales["barral_recto"] = Number(row[1]) || 0;
  }

  if (texto === "manija metalica") {
    adicionales["manija_metalica"] = Number(row[1]) || 0;
  }
}

// OUTPUT FINAL
const resultado = {
  linea: "modena",
  modelos,
  adicionales
};

// GUARDAR
fs.writeFileSync(
  "data/productos/puertas_modena.json",
  JSON.stringify(resultado, null, 2)
);

console.log("✅ JSON de Modena generado correctamente");