const { execSync } = require("child_process");
const path = require("path");

const scriptsDir = __dirname;

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
run("Colores", `node "${path.join(scriptsDir, "impColores.js")}"`);
run("Mosquiteros", `node "${path.join(scriptsDir, "impMosquiteros.js")}"`);
run(
  "Patagonicas Modena",
  `node "${path.join(scriptsDir, "impPatagonicasModena.js")}"`,
);
run("Postigones", `node "${path.join(scriptsDir, "impPostigones.js")}"`);
run("Puertas Eco", `node "${path.join(scriptsDir, "impPuertasEco.js")}"`);
run("Puertas Herrero", `node "${path.join(scriptsDir, "impPuertasHerrero.js")}"`);
run("Puertas Medias", `node "${path.join(scriptsDir, "impPuertasmedias.js")}"`);
run("Puertas Modena", `node "${path.join(scriptsDir, "impPuertasModena.js")}"`);
run("Puertas Placa", `node "${path.join(scriptsDir, "impPuertasPlaca.js")}"`);
run("Rajas Herrero", `node "${path.join(scriptsDir, "impRajasHerrero.js")}"`);
run("Rajas Modena", `node "${path.join(scriptsDir, "impRajasModena.js")}"`);
run("Ventanas Herrero", `node "${path.join(scriptsDir, "impVentanasHerrero.js")}"`);
run("Ventanas Modena", `node "${path.join(scriptsDir, "impVentanasModena.js")}"`);

console.log("\n🎯 IMPORTACIÓN COMPLETA\n");
  
