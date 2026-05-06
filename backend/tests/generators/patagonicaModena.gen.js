const fs = require("fs");
const path = require("path");

const { fromRoot } = require("../../utils/path");

const calcular = require(
  fromRoot("wrappers/patagonicas/calcularPatagonicaModena"),
);

const medidas = ["100x60", "150x100", "200x100"];
const colores = ["blanco", "negro", "simil madera"];

let resultados = [];

medidas.forEach((medida) => {
  colores.forEach((color) => {
    [1, 2].forEach((cantidadRajas) => {
      try {
        const res = calcular({
          medida,
          cantidadRajas,
          tipoVidrio: "4mm",
          color,
          tipoApertura: "oscilobatiente",
        });

        resultados.push({ input: { medida }, output: res });

        console.log(`✔ ${medida} ${cantidadRajas}`);
      } catch (e) {
        resultados.push({ input: { medida }, error: e.message });

        console.log(`❌ ${medida}`, e.message);
      }
    });
  });
});

const outputDir = path.join(
  process.cwd(),
  "backend/tests/output/patagonicaModena",
);

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(
  path.join(outputDir, `patagonica_modena_${Date.now()}.json`),
  JSON.stringify(resultados, null, 2),
);

console.log("\n✅ GENERATOR MODENA OK");
