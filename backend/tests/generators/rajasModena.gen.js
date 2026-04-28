const fs = require("fs");
const path = require("path");

const { fromRoot } = require("../../utils/path");

const data = require(fromRoot("frontend/data/productos/rajas_modena.json"));

const calcularRajaModena = require(
  fromRoot("wrappers/rajas/calcularRajaModena"),
);

const CONFIG = {
  colores: ["blanco", "negro", "bronce", "simil madera"],
  vidrios: ["4mm", "3+3", "4+4", "dvh_5_9_5"],
};

let resultados = [];

const outputDir = path.join(process.cwd(), "backend/tests/output/rajaModena");
if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

Object.keys(data.medidas).forEach((medida) => {
  const [ancho, alto] = medida.split("x").map(Number);

  CONFIG.colores.forEach((color) => {
    CONFIG.vidrios.forEach((vidrio) => {
      try {
        const res = calcularRajaModena({
          ancho,
          alto,
          color,
          vidrio,
        });

        resultados.push({ input: { ancho, alto, color, vidrio }, output: res });

        console.log(`✔ ${medida} ${color} ${vidrio}`);
      } catch (e) {
        resultados.push({
          input: { ancho, alto, color, vidrio },
          error: e.message,
        });
        console.log(`❌ ${medida} ${color} ${vidrio}`);
      }
    });
  });
});

const file = `raja_modena_${Date.now()}.json`;

fs.writeFileSync(
  path.join(outputDir, file),
  JSON.stringify(resultados, null, 2),
);

console.log(`\n✅ JSON generado: ${file}`);
