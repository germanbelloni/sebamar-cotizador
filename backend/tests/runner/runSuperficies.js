const path = require("path");

console.log("\nRUN SUPERFICIES\n");

function run(nombre, ruta) {
  try {
    console.log(`Ejecutando ${nombre}...`);
    require(ruta);
    console.log(`${nombre} OK\n`);
  } catch (err) {
    console.log(`ERROR en ${nombre}`);
    console.error(err.message, "\n");
  }
}

run("Pano Fijo", path.join(__dirname, "..", "panoFijo.test.js"));
run("Premarco", path.join(__dirname, "..", "premarco.test.js"));
run("Contramarco", path.join(__dirname, "..", "contramarco.test.js"));

console.log("Fin de superficies\n");
