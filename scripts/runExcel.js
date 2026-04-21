const { execSync } = require("child_process");

function run(name, cmd) {
  console.log(`\n📥 ${name}\n`);
  try {
    execSync(cmd, { stdio: "inherit" });
    console.log(`\n✅ ${name} OK\n`);
  } catch (err) {
    console.error(`\n❌ ERROR en ${name}`);
    process.exit(1);
  }
}

// 🔥 TODOS LOS IMPORTADORES
run("Colores", "node scripts/impColores.js");
run("Mosquiteros", "node scripts/impMosquiteros.js");
run("Patagonicas Modena", "node scripts/impPatagonicasModena.js");
run("Postigones", "node scripts/impPostigones.js");
run("Puertas Eco", "node scripts/impPuertasEco.js");
run("Puertas Herrero", "node scripts/impPuertasHerrero.js");
run("Puertas Medias", "node scripts/impPuertasmedias.js");
run("Puertas Modena", "node scripts/impPuertasModena.js");
run("Puertas Placa", "node scripts/impPuertasPlaca.js");
run("Rajas Herrero", "node scripts/impRajasHerrero.js");
run("Rajas Modena", "node scripts/impRajasModena.js");
run("Ventanas Herrero", "node scripts/impVentanasHerrero.js");
run("Ventanas Modena", "node scripts/impVentanasModena.js");

console.log("\n🎯 IMPORTACIÓN COMPLETA\n");
  