const fs = require("fs");
const path = require("path");

const { nearlyEqual, diffNumber } = require(
  path.join(__dirname, "compareUtils"),
);

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

const actual = JSON.parse(fs.readFileSync(actualPath, "utf8"));
const baseline = JSON.parse(fs.readFileSync(baselinePath, "utf8"));

const TOLERANCIA = 0.01;

let errores = [];
let ok = 0;

actual.forEach((item, i) => {
  const base = baseline[i];

  if (!base) {
    errores.push(`❌ Caso ${i} no existe en baseline`);
    return;
  }

  if (item.error || base.error) {
    if (item.error !== base.error) {
      errores.push(`❌ Error inconsistente caso ${i}`);
    }
    return;
  }

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

function desc(i) {
  return `${i.ancho}x${i.alto} ${i.color}`;
}

console.log("\n📊 CONTRAMARCO\n");

if (errores.length) {
  console.log(`❌ ${errores.length} errores\n`);
  errores.forEach((e) => console.log(e));
} else {
  console.log(`✅ OK (${ok} casos)`);
}
