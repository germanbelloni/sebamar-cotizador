// backend/tests/runner/runGenerators.js

const fs = require("fs");

const path = require("path");

const { spawnSync } = require("child_process");

// =========================
// 🚨 START
// =========================

console.log("🚨 RUNNER EJECUTADO", new Date().toISOString());

// =========================
// 🛑 ANTI LOOP
// =========================

if (process.env.RUNNER_ACTIVE === "true") {
  console.log("⛔ Runner ya activo → cancelado");

  process.exit(0);
}

// =========================
// 🔧 PATHS
// =========================

const BASE_TESTS_DIR = path.resolve(__dirname, "..");

const GENERATORS_DIR = path.join(BASE_TESTS_DIR, "generators");

const OUTPUT_DIR = path.join(BASE_TESTS_DIR, "generated");

// =========================
// 🧹 CLEAN OUTPUT
// =========================

if (fs.existsSync(OUTPUT_DIR)) {
  fs.rmSync(OUTPUT_DIR, {
    recursive: true,
    force: true,
  });
}

fs.mkdirSync(OUTPUT_DIR, {
  recursive: true,
});

// =========================
// 🎯 GENERATORS
// =========================

const generators = [
  "patagonicaHerrero.gen.js",

  "patagonicaModena.gen.js",

  "postigon.gen.js",

  "puertas.gen.js",

  "puerta_y_media.gen.js",

  "puertaPlaca.gen.js",

  "rajasHerrero.gen.js",

  "rajasModena.gen.js",

  "ventanaHerrero.gen.js",

  "ventanaModena.gen.js",

  "superficies.gen.js",

  "mosquiteros.gen.js",
];

// =========================
// 🔍 DEBUG
// =========================

console.log("\n🔧 Generators a ejecutar:\n");

generators.forEach((g) => {
  console.log(` - ${g}`);
});

console.log("");

// =========================
// 📊 TRACKING
// =========================

const errores = [];

let ejecutados = 0;

// =========================
// 🚀 EJECUCION
// =========================

generators.forEach((generatorName) => {
  const file = path.join(GENERATORS_DIR, generatorName);

  // =========================
  // 🔍 EXISTE?
  // =========================

  if (!fs.existsSync(file)) {
    console.log(`⚠ NO EXISTE: ${generatorName}`);

    errores.push({
      generator: generatorName,

      error: "Archivo no encontrado",

      file,
    });

    return;
  }

  console.log(`▶ Ejecutando: ${generatorName}`);

  // =========================
  // 🚀 SPAWN
  // =========================

  const result = spawnSync("node", [file], {
    encoding: "utf-8",

    maxBuffer: 1024 * 1024 * 100,

    env: {
      ...process.env,

      OUTPUT_DIR,

      RUNNER_ACTIVE: "true",
    },
  });

  ejecutados++;

  // =========================
  // 📤 STDOUT
  // =========================

  if (result.stdout) {
    console.log(result.stdout);
  }

  // =========================
  // ❌ STDERR
  // =========================

  if (result.stderr) {
    console.log(result.stderr);
  }

  // =========================
  // ✅ OK
  // =========================

  if (result.status === 0) {
    console.log("✔ OK\n");

    return;
  }

  // =========================
  // ❌ ERROR
  // =========================

  console.log(`❌ ERROR en ${generatorName}\n`);

  errores.push({
    generator: generatorName,

    status: result.status,

    signal: result.signal,

    stdout: result.stdout,

    stderr: result.stderr,

    error: result.error ? result.error.message : `Exit code ${result.status}`,

    file,
  });
});

// =========================
// 📊 RESUMEN
// =========================

console.log("\n📊 RESUMEN FINAL");

console.log(`Total definidos: ${generators.length}`);

console.log(`Ejecutados: ${ejecutados}`);

console.log(`OK: ${ejecutados - errores.length}`);

console.log(`Errores: ${errores.length}`);

// =========================
// ❌ ERRORES
// =========================

if (errores.length) {
  console.log("\n❌ FALLARON:\n");

  errores.forEach((e) => {
    console.log(` - ${e.generator}`);

    console.log(`   👉 ${e.error}`);
  });
}

// =========================
// 💾 SAVE ERROR REPORT
// =========================

const errorReportPath = path.join(OUTPUT_DIR, "errores.json");

fs.writeFileSync(
  errorReportPath,

  JSON.stringify(errores, null, 2),
);

console.log(`\n📝 Error report: ${errorReportPath}`);

// =========================
// 📁 OUTPUT
// =========================

console.log(`\n📁 Output limpio: ${OUTPUT_DIR}`);

// =========================
// ✅ END
// =========================

console.log(`\n✅ RUN COMPLETO\n`);
