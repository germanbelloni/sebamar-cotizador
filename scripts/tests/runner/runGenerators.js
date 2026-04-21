const fs = require("fs");
const path = require("path");
const { spawnSync } = require("child_process");

console.log("🚨 RUNNER EJECUTADO", new Date().toISOString());

// 🛑 ANTI-LOOP GLOBAL
if (process.env.RUNNER_ACTIVE === "true") {
  console.log("⛔ Runner ya activo → cancelado");
  process.exit(0);
}

// 🔧 PATH BASE
const BASE_TESTS_DIR = path.resolve(__dirname, "..");

// 📁 GENERATORS
const GENERATORS_DIR = path.join(BASE_TESTS_DIR, "generators");

// 📁 OUTPUTS ROOT
const OUTPUTS_DIR = path.join(BASE_TESTS_DIR, "outputs");

// 🕒 TIMESTAMP ÚNICO
function getTimestamp() {
  const now = new Date();

  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const hh = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");
  const ms = String(now.getMilliseconds()).padStart(3, "0");

  return `run_${yyyy}-${mm}-${dd}_${hh}-${min}-${ss}-${ms}`;
}

// 📁 CREAR RUN
const runName = getTimestamp();
const runDir = path.join(OUTPUTS_DIR, runName);

fs.mkdirSync(runDir, { recursive: true });

console.log(`\n📦 RUN: ${runName}\n`);

// 🎯 LISTA EXACTA (alineada con tus archivos reales)
const archivosValidos = [
  "patagonicaHerrero.test.js",
  "patagonicaModena.test.js",

  "postigon.test.js",
  "puertas.test.js",
  "puertaPlaca.test.js",
  "puerta_y_media.test.js",

  "rajasHerrero.test.js",
  "rajasModena.test.js",

  "ventanaHerrero.test.js",
  "ventanaModena.test.js",
];

// 🔍 ARMAR PATHS
const generators = archivosValidos.map((file) =>
  path.join(GENERATORS_DIR, file),
);

// 🔍 DEBUG
console.log("🔧 Generators a ejecutar:");
generators.forEach((g) => console.log(" -", path.basename(g)));
console.log("");

// 📊 TRACKING
let errores = [];
let ejecutados = 0;

// 🚀 EJECUCIÓN
generators.forEach((file) => {
  const nombre = path.basename(file);

  if (!fs.existsSync(file)) {
    console.log(`⚠ NO EXISTE: ${nombre}`);
    errores.push(nombre);
    return;
  }

  console.log(`▶ Ejecutando: ${nombre}`);

  const result = spawnSync("node", [file], {
    stdio: "inherit",
    env: {
      OUTPUT_DIR: `scripts/tests/outputs/${runName}`,
      RUNNER_ACTIVE: "true",
    },
  });

  ejecutados++;

  if (result.status === 0) {
    console.log(`✔ OK\n`);
  } else {
    console.log(`❌ ERROR en ${nombre}\n`);
    errores.push(nombre);
  }
});

// 📊 RESUMEN FINAL
console.log("\n📊 RESUMEN FINAL");
console.log(`Total definidos: ${generators.length}`);
console.log(`Ejecutados: ${ejecutados}`);
console.log(`OK: ${ejecutados - errores.length}`);
console.log(`Errores: ${errores.length}`);

if (errores.length) {
  console.log("\n❌ FALLARON:");
  errores.forEach((e) => console.log(" -", e));
}

console.log(`\n📁 Output: scripts/tests/outputs/${runName}`);
console.log(`\n✅ RUN COMPLETO: ${runName}\n`);
