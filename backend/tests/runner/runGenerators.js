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

// 📁 OUTPUT
const OUTPUT_DIR = path.join(BASE_TESTS_DIR, "output");

// 🧹 LIMPIAR OUTPUT (🔥 IMPORTANTE)
if (fs.existsSync(OUTPUT_DIR)) {
  fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
}
fs.mkdirSync(OUTPUT_DIR, { recursive: true });

// 🎯 LISTA COMPLETA
const archivosValidos = [
  // 🏔 PATAGONICAS
  "patagonicaHerrero.gen.js",
  "patagonicaModena.gen.js",

  // 🧱 POSTIGONES
  "postigon.gen.js",

  // 🚪 PUERTAS
  "puertas.gen.js",
  "puerta_y_media.gen.js",

  // 🪵 PLACAS
  "puertaPlaca.gen.js",

  // 🔳 RAJAS
  "rajasHerrero.gen.js",
  "rajasModena.gen.js",

  // 🪟 VENTANAS
  "ventanaHerrero.gen.js",
  "ventanaModena.gen.js",

  // 🧱 SUPERFICIES (🔥 AHORA UNIFICADO)
  "superficies.gen.js",

  // 🚪 PORTONES
  "portones.gen.js",
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
      ...process.env,
      OUTPUT_DIR: OUTPUT_DIR,
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

console.log(`\n📁 Output limpio: ${OUTPUT_DIR}`);
console.log(`\n✅ RUN COMPLETO\n`);
