const fs = require("fs");
const path = require("path");

const { fromRoot } = require("../../utils/path");

const calcular = require(fromRoot("wrappers/postigones/calcularPostigones"));

const data = require(fromRoot("frontend/data/productos/postigones.json"));

const colores = ["blanco", "negro"];

let resultados = [];

Object.keys(data.medidas).forEach((medida) => {
  colores.forEach((color) => {
    ["corredizo", "abrir"].forEach((tipo) => {
      try {
        const result = calcular({
          medida,
          tipo,
          color,
          hojas: 2,
        });

        resultados.push({
          input: { medida, tipo, color },
          output: result,
        });

        console.log(`✔ ${medida} ${tipo}`);
      } catch (e) {
        console.log(`❌ ${medida} ${tipo}`, e.message);
      }
    });
  });
});

fs.writeFileSync(
  path.join(process.cwd(), "postigones_test.json"),
  JSON.stringify(resultados, null, 2),
);
