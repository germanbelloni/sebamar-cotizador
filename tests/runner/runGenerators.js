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

// 📁 OUTPUT (único y limpio)
const OUTPUT_DIR = path.join(BASE_TESTS_DIR, "output");

// asegurar carpeta output
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

// 🎯 LISTA EXACTA
const archivosValidos = [
  "patagonicaHerrero.gen.js",
  "patagonicaModena.gen.js",

  "postigon.gen.js",
  "puertas.gen.js",
  "puertaPlaca.gen.js",
  "puerta_y_media.gen.js",

  "rajasHerrero.gen.js",
  "rajasModena.gen.js",

  "ventanaHerrero.gen.js",
  "ventanaModena.gen.js",
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

console.log(`\n📁 Output: ${OUTPUT_DIR}`);
console.log(`\n✅ RUN COMPLETO\n`);
