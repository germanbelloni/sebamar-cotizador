async function generar(workbook) {
  console.log("📦 Catálogo cargado.");

  console.log("Hojas encontradas:");

  workbook.SheetNames.forEach((hoja) => {
    console.log(` - ${hoja}`);
  });
}

module.exports = generar;
