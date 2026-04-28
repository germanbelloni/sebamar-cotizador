const fs = require("fs");
const path = require("path");

const { fromRoot } = require("../../utils/path");

const calcularRajaHerrero = require(
  fromRoot("wrappers/rajas/calcularRajaHerrero"),
);

const data = require(fromRoot("frontend/data/productos/rajas_herrero.json"));

const COLORES = ["blanco", "negro", "bronce", "simil madera"];
const VIDRIOS = ["3mm", "4mm", "5mm", "3+3"];

let resultados = [];

Object.keys(data.medidas).forEach((medida) => {
  const [ancho, alto] = medida.split("x").map(Number);

  COLORES.forEach((color) => {
    VIDRIOS.forEach((vidrio) => {
      const input = {
        ancho,
        alto,
        color,
        vidrio,
      };

      try {
        const res = calcularRajaHerrero(input);

        resultados.push({ input, output: res });

        console.log(`✔ ${medida} ${color} ${vidrio}`);
      } catch (e) {
        resultados.push({ input, error: e.message });

        console.log(`❌ ${medida} ${color} ${vidrio}`);
      }
    });
  });
});

const outputDir = path.join(process.cwd(), "backend/tests/output/rajaHerrero");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const file = path.join(outputDir, `raja_herrero_${Date.now()}.json`);

fs.writeFileSync(file, JSON.stringify(resultados, null, 2));

console.log("\n✅ JSON generado");
