const fs = require("fs");
const path = require("path");

const { fromRoot } = require("../../utils/path");

const calcular = require(
  fromRoot("wrappers/patagonicas/calcularPatagonicaHerrero"),
);

const CONFIG = {
  medidas: ["120x100", "150x100", "200x100"],
  tipos: ["1_raja", "2_rajas"],
  colores: ["blanco", "negro", "simil madera"],
  rajas: [
    { ancho: 40, tipoVidrio: "4mm" },
    { ancho: 50, tipoVidrio: "4mm" },
  ],
};

let resultados = [];

CONFIG.tipos.forEach((tipo) => {
  CONFIG.medidas.forEach((medidaTotal) => {
    CONFIG.colores.forEach((color) => {
      CONFIG.rajas.forEach((raja) => {
        const input = {
          medidaTotal,
          tipo,
          raja,
          color,
          tipoApertura: "abrir",
          ladoApertura: "derecha",
        };

        try {
          const res = calcular(input);

          resultados.push({ input, output: res });

          console.log(`✔ ${medidaTotal} ${tipo} ${color}`);
        } catch (e) {
          resultados.push({ input, error: e.message });

          console.log(`❌ ${medidaTotal} ${tipo}`);
        }
      });
    });
  });
});

const outputDir = path.join(
  process.cwd(),
  "backend/tests/output/patagonicaHerrero",
);

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(
  path.join(outputDir, `patagonica_herrero_${Date.now()}.json`),
  JSON.stringify(resultados, null, 2),
);

console.log("\n✅ GENERATOR HERRERO OK");
