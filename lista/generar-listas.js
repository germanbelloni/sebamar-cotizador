const leerCatalogo = require("./core/leerCatalogo");
const generar = require("./core/generador");

async function main() {
  try {
    console.log("=====================================");
    console.log(" Generador de Listas Comerciales");
    console.log("=====================================\n");

    const catalogo = await leerCatalogo();

    await generar(catalogo);

    console.log("\n✅ Listas generadas correctamente.");
  } catch (error) {
    console.error("\n❌ Error al generar las listas:");
    console.error(error);
  }
}

main();
