const { execSync } = require("child_process");

function run(name, cmd) {
  console.log(`\n🧪 ${name}\n`);
  try {
    execSync(cmd, { stdio: "inherit" });
    console.log(`\n✅ ${name} OK\n`);
  } catch (err) {
    console.error(`\n❌ ERROR en ${name}`);
    process.exit(1);
  }
}

// 🔥 TODOS LOS GENERADORES
run("Ventana Herrero", "node scripts/tests/generators/ventanaHerrero.test.js");
run("Ventana Modena", "node scripts/tests/generators/ventanaModena.test.js");

run("Rajas Herrero", "node scripts/tests/generators/rajasHerrero.test.js");
run("Rajas Modena", "node scripts/tests/generators/rajasModena.test.js");

run("Puertas", "node scripts/tests/generators/puertas.test.js");
run("Puerta y Media", "node scripts/tests/generators/puerta_y_media.test.js");

run("Puerta Placa", "node scripts/tests/generators/puertaPlaca.test.js");

run("Postigon", "node scripts/tests/generators/postigon.test.js");

run(
  "Patagonica Herrero",
  "node scripts/tests/generators/patagonicaHerrero.test.js",
);
run(
  "Patagonica Modena",
  "node scripts/tests/generators/patagonicaModena.test.js",
);

console.log("\n🎯 GENERADORES COMPLETOS\n");
