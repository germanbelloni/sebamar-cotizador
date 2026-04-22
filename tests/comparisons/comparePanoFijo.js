const fs = require("fs");
const path = require("path");

const { nearlyEqual, diffNumber } = require("./compareUtils");

const actual = JSON.parse(
  fs.readFileSync(
    path.join(process.cwd(), "tests/output/panoFijo.json"),
    "utf8",
  ),
);

const baseline = JSON.parse(
  fs.readFileSync(
    path.join(process.cwd(), "tests/baseline/panoFijo.json"),
    "utf8",
  ),
);

// indexar baseline por id
const baseMap = new Map();
baseline.forEach((i) => baseMap.set(i.id, i));

const TOLERANCIA = 0.01;

let errores = [];
let nuevos = [];
let ok = 0;

actual.forEach((item) => {
  const base = baseMap.get(item.id);

  if (!base) {
    nuevos.push(`🆕 Nuevo caso: ${item.id}`);
    return;
  }

  if (item.error || base.error) {
    if (item.error !== base.error) {
      errores.push(`❌ Error inconsistente: ${item.id}`);
    }
    return;
  }

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

// detectar eliminados
baseline.forEach((b) => {
  if (!actual.find((a) => a.id === b.id)) {
    errores.push(`🗑 Caso eliminado: ${b.id}`);
  }
});

console.log("\n📊 RESULTADO\n");

if (errores.length) {
  console.log(`❌ ${errores.length} problemas\n`);
  errores.forEach((e) => console.log(e));
}

if (nuevos.length) {
  console.log(`\n🆕 ${nuevos.length} nuevos\n`);
  nuevos.forEach((n) => console.log(n));
}

if (!errores.length) {
  console.log(`✅ OK (${ok} casos consistentes)`);
}
