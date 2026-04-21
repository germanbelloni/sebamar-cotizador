const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

// 🔧 PATH BASE
const BASE_TESTS_DIR = path.resolve(__dirname, "..");

// 📁 GENERATORS
const GENERATORS_DIR = path.join(BASE_TESTS_DIR, "generators");

// 📁 OUTPUTS ROOT
const OUTPUTS_DIR = path.join(BASE_TESTS_DIR, "outputs");

// 🕒 CREAR NOMBRE DE RUN
function getTimestamp() {
  const now = new Date();

  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const hh = String(now.getHours()).padStart(2, "0");
  const min = String(now.getMinutes()).padStart(2, "0");
  const ss = String(now.getSeconds()).padStart(2, "0");

  return `run_${yyyy}-${mm}-${dd}_${hh}-${min}-${ss}`;
}

// 📁 CREAR RUN
const runName = getTimestamp();
const runDir = path.join(OUTPUTS_DIR, runName);

fs.mkdirSync(runDir, { recursive: true });

console.log(`\n📦 RUN: ${runName}\n`);

// 🔍 BUSCAR GENERATORS
function getAllGenerators(dir) {
  let results = [];

  const list = fs.readdirSync(dir);

  list.forEach((file) => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      results = results.concat(getAllGenerators(fullPath));
    } else {
      if (file.endsWith(".test.js")) {
        results.push(fullPath);
      }
    }
  });

  return results;
}

const generators = getAllGenerators(GENERATORS_DIR);

console.log(`🔧 Generators encontrados: ${generators.length}\n`);

// 🚀 EJECUTAR

console.log(`\n✅ RUN COMPLETO: ${runName}`);
