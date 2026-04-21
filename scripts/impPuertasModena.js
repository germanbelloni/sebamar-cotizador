const XLSX = require("xlsx");
const fs = require("fs");
const { fromRoot } = require("../utils/path");

// CONFIG
const archivo = fromRoot("excel/calculadora.xlsx");
const hojaNombre = "puertas modena";

// HELPERS
const norm = (t) => t?.toString().toLowerCase().trim();
const num = (v) => {
  if (typeof v === "string") v = v.replace(",", ".");
  const n = Number(v);
  return isNaN(n) ? 0 : Math.round(n);
};

// LEER
const workbook = XLSX.readFile(archivo);
const sheet = workbook.Sheets[hojaNombre];

if (!sheet) throw new Error("Hoja no encontrada");

const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });

// 🔥 BUSCAR INICIO TABLA IZQUIERDA
const start = data.findIndex((row) =>
  row[0]?.toString().toLowerCase().includes("modelo 1"),
);

if (start === -1) {
  throw new Error("No se encontró tabla de modelos");
}

// RESULTADO
const modelos = {};

// 🔥 RECORRER FILAS
for (let i = start; i < data.length; i++) {
  const row = data[i];

  if (!row || !row[0]) continue;

  const nombre = norm(row[0]);

  // cortar cuando termina tabla
  if (nombre.includes("adicionales")) break;
  if (!nombre.includes("modelo")) continue;

  modelos[nombre] = {
    base: num(row[1]),
    vidrios: {
      "3mm": num(row[2]),
      "4mm": num(row[3]),
      "5mm": num(row[4]),
      fantasia: num(row[5]),
      esmerilado: num(row[6]),
      "3+3": num(row[7]),
    },
    dvh: {
      camara: num(row[8]),
    },
  };
}

// 🔥 ADICIONALES
const adicionales = {};

data.forEach((row) => {
  if (!row[0]) return;

  const t = norm(row[0]);

  if (t.includes("barral") && t.includes("curvo"))
    adicionales["barral_curvo"] = num(row[1]);

  if (t.includes("barral") && t.includes("recto"))
    adicionales["barral_recto"] = num(row[1]);

  if (t.includes("manija")) adicionales["manija_metalica"] = num(row[1]);
});

// OUTPUT
const resultado = {
  linea: "modena",
  modelos,
  adicionales,
};

fs.writeFileSync(
  fromRoot("frontend/data/productos/puertas_modena.json"),
  JSON.stringify(resultado, null, 2),
);

console.log("✅ PUERTAS MODENA OK");
console.log("📊 Modelos:", Object.keys(modelos).length);
