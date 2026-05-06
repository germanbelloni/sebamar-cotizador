const fs = require("fs");
const path = require("path");

const { fromRoot } = require("../../utils/path");

const calcular = require(fromRoot("wrappers/superficies/calcularSuperficies"));

const tipos = ["pano_fijo", "premarco", "contramarco"];
const medidas = [
  { ancho: 100, alto: 100 },
  { ancho: 150, alto: 120 },
  { ancho: 200, alto: 150 },
];

const lineas = ["herrero", "modena"];
const colores = ["blanco", "negro"];
const vidrios = ["3mm", "4mm"];

let resultados = [];

tipos.forEach((tipo) => {
  medidas.forEach(({ ancho, alto }) => {
    colores.forEach((color) => {
      lineas.forEach((linea) => {
        vidrios.forEach((vidrio) => {
          try {
            const input = {
              tipo,
              ancho,
              alto,
              linea,
              color,
            };

            if (tipo === "pano_fijo") {
              input.tipoVidrio = vidrio;
            }

            const res = calcular(input);

            resultados.push({
              input,
              output: res,
            });

            console.log(`✔ ${tipo} ${ancho}x${alto}`);
          } catch (e) {
            resultados.push({
              input: { tipo, ancho, alto },
              error: e.message,
            });

            console.log(`❌ ${tipo} ${ancho}x${alto}`);
          }
        });
      });
    });
  });
});

const outputDir = path.join(process.cwd(), "tests/output/superficies");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const file = path.join(outputDir, `superficies_${Date.now()}.json`);

fs.writeFileSync(file, JSON.stringify(resultados, null, 2));

console.log("\n✅ JSON generado:", file);
