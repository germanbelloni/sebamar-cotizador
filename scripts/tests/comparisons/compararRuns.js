const fs = require("fs");
const path = require("path");

// 🔧 PATH BASE
const BASE_DIR = path.resolve(__dirname, "..");
const OUTPUTS_DIR = path.join(BASE_DIR, "outputs");

// 🎯 RUNS (LOS DEFINÍS VOS)
const RUN_BASE = "run_2026-04-22_10-21-28-356"; // ← cambiar
const RUN_NUEVO = "run_2026-04-22_10-22-14-546"; // ← cambiar

// 🛑 VALIDACIÓN
if (!RUN_BASE || !RUN_NUEVO) {
  console.log("❌ Definí RUN_BASE y RUN_NUEVO en el archivo");
  process.exit(1);
}

const baseDir = path.join(OUTPUTS_DIR, RUN_BASE);
const nuevoDir = path.join(OUTPUTS_DIR, RUN_NUEVO);

if (!fs.existsSync(baseDir) || !fs.existsSync(nuevoDir)) {
  console.log("❌ Uno de los runs no existe");
  process.exit(1);
}

// 🔍 HELPERS

function leerJSONs(dirProducto) {
  if (!fs.existsSync(dirProducto)) return [];

  const files = fs.readdirSync(dirProducto);
  let data = [];

  files.forEach((file) => {
    if (!file.endsWith(".json")) return;

    const content = JSON.parse(
      fs.readFileSync(path.join(dirProducto, file), "utf-8"),
    );

    data = data.concat(content);
  });

  return data;
}

function mapearPorInput(arr) {
  const map = new Map();

  arr.forEach((item) => {
    const key = JSON.stringify(item.input);
    map.set(key, item);
  });

  return map;
}

// 🔍 PRODUCTOS
const productos = fs.readdirSync(baseDir);

// 📊 RESULTADOS
let iguales = 0;
let cambios = 0;
let nuevos = 0;
let eliminados = 0;

let detalleCambios = [];

// 🚀 COMPARACIÓN
productos.forEach((producto) => {
  const baseProductoDir = path.join(baseDir, producto);
  const nuevoProductoDir = path.join(nuevoDir, producto);

  const baseData = leerJSONs(baseProductoDir);
  const nuevoData = leerJSONs(nuevoProductoDir);

  const baseMap = mapearPorInput(baseData);
  const nuevoMap = mapearPorInput(nuevoData);

  // 🔁 comparar base → nuevo
  baseMap.forEach((baseItem, key) => {
    const nuevoItem = nuevoMap.get(key);

    if (!nuevoItem) {
      eliminados++;
      return;
    }

    const totalBase = baseItem.output?.total;
    const totalNuevo = nuevoItem.output?.total;

    if (totalBase === totalNuevo) {
      iguales++;
    } else {
      cambios++;
      detalleCambios.push({
        producto,
        input: baseItem.input,
        antes: totalBase,
        ahora: totalNuevo,
      });
    }
  });

  // 🔁 detectar nuevos
  nuevoMap.forEach((_, key) => {
    if (!baseMap.has(key)) {
      nuevos++;
    }
  });
});

// 📊 RESULTADO
console.log("\n📊 RESULTADO COMPARACIÓN\n");

console.log("Run base:", RUN_BASE);
console.log("Run nuevo:", RUN_NUEVO);

console.log("\nTotales:");
console.log("Iguales:", iguales);
console.log("Cambios:", cambios);
console.log("Nuevos:", nuevos);
console.log("Eliminados:", eliminados);

// 🔍 DETALLE CAMBIOS
if (detalleCambios.length) {
  console.log("\n⚠ CAMBIOS DETECTADOS:\n");

  detalleCambios.slice(0, 20).forEach((c) => {
    console.log("Producto:", c.producto);
    console.log("Input:", JSON.stringify(c.input));
    console.log("Antes:", c.antes);
    console.log("Ahora:", c.ahora);
    console.log("------");
  });

  if (detalleCambios.length > 20) {
    console.log(`... y ${detalleCambios.length - 20} más`);
  }
} else {
  console.log("\n✅ Sin cambios");
}
