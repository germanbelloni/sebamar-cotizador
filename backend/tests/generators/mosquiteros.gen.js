// backend/tests/generators/mosquiteros.generator.js

const fs = require("fs");
const path = require("path");

const { fromRoot } = require("../../utils/path");

const calcularMosquiteroVentana = require(
  fromRoot("wrappers/mosquiteros/calcularMosquiteroVentana"),
);

const data = require(fromRoot("backend/data/productos/mosquiteros.json"));

const resultados = [];

const outputDir = fromRoot("backend/tests/generated/mosquiteros");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, {
    recursive: true,
  });
}

const colores = ["blanco", "negro", "bronce", "simil madera"];

function parseMedida(medida) {
  const [anchoStr, altoStr] = medida.split("x");

  return {
    ancho: Number(anchoStr.replace(",", ".")),
    alto: Number(altoStr.replace(",", ".")),
  };
}

Object.keys(data.medidas || {}).forEach((medida) => {
  const { ancho, alto } = parseMedida(medida);

  if (Number.isNaN(ancho) || Number.isNaN(alto)) {
    resultados.push({
      ok: false,
      input: { medida },
      error: "Medida inválida",
    });

    return;
  }

  colores.forEach((color) => {
    const input = {
      ancho,
      alto,
      color,
    };

    try {
      const output = calcularMosquiteroVentana(input);

      resultados.push({
        ok: true,
        input,
        output,
      });

      console.log(`✔ ${medida} | ${color}`);
    } catch (error) {
      resultados.push({
        ok: false,
        input,
        error: error.message,
      });

      console.log(`❌ ${medida} | ${color}`);
    }
  });
});

const fileName = `mosquiteros_${Date.now()}.json`;

const outputPath = path.join(outputDir, fileName);

fs.writeFileSync(outputPath, JSON.stringify(resultados, null, 2));

const ok = resultados.filter((r) => r.ok).length;

const errores = resultados.length - ok;

console.log("\n✅ Generator Mosquiteros OK");

console.log(`📁 ${outputPath}`);
console.log(`📦 Casos: ${resultados.length}`);
console.log(`✅ OK: ${ok}`);
console.log(`❌ Errores: ${errores}`);
