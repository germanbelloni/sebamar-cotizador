const fs = require("fs");
const path = require("path");

const { nearlyEqual, diffNumber } = require(
  path.join(__dirname, "compareUtils"),
);

// 📁 PATHS (acá SÍ usamos process.cwd)
const actualPath = path.join(
  process.cwd(),
  "tests",
  "output",
  "contramarco.json",
);

const baselinePath = path.join(
  process.cwd(),
  "tests",
  "baseline",
  "contramarco.json",
);

// 🔍 VALIDACIÓN DE ARCHIVOS
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

const TOLERANCIA = 0.01;

let errores = [];
let ok = 0;

// =========================
// 🔍 COMPARACIÓN
// =========================
actual.forEach((item, i) => {
  const base = baseline[i];

  if (!base) {
    errores.push(`❌ Caso ${i} no existe en baseline`);
    return;
  }

  // 🔥 manejo de errores esperados
  if (item.error || base.error) {
    if (item.error !== base.error) {
      errores.push(`❌ Error inconsistente caso ${i}`);
    }
    return;
  }

  // 🔢 comparar totales
  if (!nearlyEqual(item.total, base.total, TOLERANCIA)) {
    errores.push(
      `❌ Caso ${i}
${desc(item)}
Actual: ${item.total}
Baseline: ${base.total}
Diff: ${diffNumber(item.total, base.total)}`,
    );
  } else {
    ok++;
  }
});

// =========================
// 🧾 HELPERS
// =========================
function desc(i) {
  return `${i.ancho}x${i.alto} ${i.color || ""}`;
}

// =========================
// 📊 OUTPUT
// =========================
console.log("\n📊 CONTRAMARCO\n");

if (errores.length) {
  console.log(`❌ ${errores.length} errores\n`);
  errores.forEach((e) => console.log(e));
} else {
  console.log(`✅ OK (${ok} casos)\n`);
}
