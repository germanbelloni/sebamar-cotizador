const { execSync } = require("child_process");
const path = require("path");

const scriptsDir = __dirname;

function run(nombre, archivo) {
  console.log(`\n📥 ${nombre}\n`);

  try {
    execSync(`node "${path.join(scriptsDir, archivo)}"`, {
      stdio: "inherit",
    });

    console.log(`\n✅ ${nombre} OK\n`);
  } catch (err) {
    console.error(`\n❌ ERROR en ${nombre}`);
    process.exit(1);
  }
}

run("Colores", "impColores.js");

run("Mosquiteros", "impMosquiteros.js");
run("Patagónicas Modena", "impPatagonicasModena.js");
run("Postigones", "impPostigones.js");

run("Puertas Eco", "impPuertasEco.js");
run("Puertas Herrero", "impPuertasHerrero.js");
run("Puertas Medias", "impPuertasMedias.js");
run("Puertas Modena", "impPuertasModena.js");
run("Puertas Placa", "impPuertasPlaca.js");

run("Rajas Herrero", "impRajasHerrero.js");
run("Rajas Modena", "impRajasModena.js");

run("Ventanas Herrero", "impVentanasHerrero.js");
run("Ventanas Modena", "impVentanasModena.js");

// ⚠️ Superficies y colores tienen ubicación especial
// Colores -> backend/generated/colores.json
// Superficies -> backend/generated/productos/superficies.json
// ⚠️ IMPORTANTE
// superficies.json NO se importa desde Excel.
// Se mantiene manualmente.
// Nunca crear impSuperficies.js sin revisar el flujo completo.

console.log("\n🎯 IMPORTACIÓN COMPLETA\n");
