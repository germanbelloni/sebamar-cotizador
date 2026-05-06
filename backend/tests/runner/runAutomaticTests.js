const fs = require("fs");

const path = require("path");

const { spawnSync } = require("child_process");

// =========================
// 🚨 START
// =========================

console.log("\n🚨 RUN AUTOMATIC TESTS\n");

// =========================
// 🔧 PATHS
// =========================

const BASE_DIR = path.resolve(__dirname, "..");

const TESTS_DIR = path.join(BASE_DIR, "automatictest");

const OUTPUT_DIR = path.join(BASE_DIR, "generated", "test_reports");

// =========================
// 🧹 CLEAN
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
// 🔍 FILES
// =========================

const files = fs.readdirSync(TESTS_DIR).filter((f) => f.endsWith(".test.js"));

// =========================
// 📊 TRACKING
// =========================

const resultados = [];

let ok = 0;

let fail = 0;

// =========================
// 🚀 RUN
// =========================

files.forEach((file) => {
  const fullPath = path.join(TESTS_DIR, file);

  console.log(`▶ ${file}`);

  const start = Date.now();

  const result = spawnSync("node", [fullPath], {
    encoding: "utf-8",

    shell: true,

    maxBuffer: 1024 * 1024 * 50,
  });

  const duration = Date.now() - start;

  const stdout = result.stdout || "";

  const stderr = result.stderr || "";

  const output = `
${stdout}

${stderr}
`;

  // 🔥 FAIL REAL
  const passed =
    !stdout.includes("❌") &&
    !stdout.includes("💥") &&
    !stderr.includes("❌") &&
    !stderr.includes("💥");

  if (passed) {
    ok++;
  } else {
    fail++;
  }

  resultados.push({
    file,

    ok: passed,

    durationMs: duration,

    output,
  });

  console.log(passed ? "✔ OK\n" : "❌ FAIL\n");
});

// =========================
// 💾 SAVE REPORT
// =========================

const reportFile = path.join(OUTPUT_DIR, `automatic_tests_${Date.now()}.json`);

fs.writeFileSync(
  reportFile,

  JSON.stringify(
    {
      total: files.length,

      ok,

      fail,

      resultados,
    },
    null,
    2,
  ),
);

// =========================
// 📊 SUMMARY
// =========================

console.log("\n📊 RESUMEN\n");

console.log(`Total: ${files.length}`);

console.log(`OK: ${ok}`);

console.log(`FAIL: ${fail}`);

console.log(`\n📁 Reporte:\n${reportFile}`);

console.log("\n✅ FIN RUNNER\n");
