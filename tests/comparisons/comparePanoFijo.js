const fs = require("fs");
const path = require("path");

const { nearlyEqual, diffNumber } = require("./compareUtils");

// 📁 PATHS (correcto usar process.cwd acá)
const actualPath = path.join(process.cwd(), "tests", "output", "panoFijo.json");
const baselinePath = path.join(
  process.cwd(),
  "tests",
  "baseline",
  "panoFijo.json",
);

// 🔍 VALIDACIÓN
if (!fs.existsSync(actualPath)) {
  console.error(`❌ No existe actual: ${actualPath}`);
  process.exit(1);
}

if (!fs.existsSync(baselinePath)) {
  console.error(`❌ No existe baseline: ${baselinePath}`);
  process.exit(1);
}

// 📦 LOAD
const actual = JSON.parse(fs.readFileSync(actualPath, "utf8"));
const baseline = JSON.parse(fs.readFileSync(baselinePath, "utf8"));

// 🗺 indexar baseline por id
const baseMap = new Map();
baseline.forEach((i) => baseMap.set(i.id, i));

const TOLERANCIA = 0.01;

let errores = [];
let nuevos = [];
let ok = 0;

// =========================
// 🔍 COMPARAR
// =========================
actual.forEach((item) => {
  const base = baseMap.get(item.id);

  if (!base) {
    nuevos.push(`🆕 Nuevo caso: ${item.id}`);
    return;
  }

  // 🔥 manejo de errores
  if (item.error || base.error) {
    if (item.error !== base.error) {
      errores.push(`❌ Error inconsistente: ${item.id}`);
    }
    return;
  }

  // 🔢 comparar total
  if (!nearlyEqual(item.total, base.total, TOLERANCIA)) {
    errores.push(
      `❌ ${item.id}
Actual: ${item.total}
Baseline: ${base.total}
Diff: ${diffNumber(item.total, base.total)}`,
    );
  } else {
    ok++;
  }
});

// =========================
// 🗑 DETECTAR ELIMINADOS
// =========================
baseline.forEach((b) => {
  if (!actual.find((a) => a.id === b.id)) {
    errores.push(`🗑 Caso eliminado: ${b.id}`);
  }
});

// =========================
// 📊 OUTPUT
// =========================
console.log("\n📊 PAÑO FIJO\n");

if (errores.length) {
  console.log(`❌ ${errores.length} problemas\n`);
  errores.forEach((e) => console.log(e));
}

if (nuevos.length) {
  console.log(`\n🆕 ${nuevos.length} nuevos\n`);
  nuevos.forEach((n) => console.log(n));
}

if (!errores.length && !nuevos.length) {
  console.log(`✅ OK (${ok} casos consistentes)\n`);
}
