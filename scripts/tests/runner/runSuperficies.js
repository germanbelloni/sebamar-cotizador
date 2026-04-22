console.log("\n📦 RUN SUPERFICIES\n");

function run(nombre, ruta) {
  try {
    console.log(`▶ Ejecutando ${nombre}...`);
    require(ruta);
    console.log(`✅ ${nombre} OK\n`);
  } catch (err) {
    console.log(`❌ ERROR en ${nombre}`);
    console.error(err.message, "\n");
  }
}

run("Paño Fijo", "./tests/panoFijo.test.js");
run("Premarco", "./tests/premarco.test.js");
run("Contramarco", "./tests/contramarco.test.js");

console.log("🏁 Fin de superficies\n");
