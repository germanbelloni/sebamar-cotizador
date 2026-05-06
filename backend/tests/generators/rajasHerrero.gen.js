const fs = require("fs");
const path = require("path");

const { fromRoot } = require("../../utils/path");

const calcular = require(fromRoot("wrappers/rajas/calcularRajaHerrero"));

const data = require(fromRoot("frontend/data/productos/rajas_herrero.json"));

const colores = ["blanco", "negro", "simil madera"];
const vidrios = ["4mm", "3+3"];

let resultados = [];

Object.keys(data.medidas).forEach((m) => {
  const [a, h] = m.split("x").map(Number);

  colores.forEach((color) => {
    vidrios.forEach((tipoVidrio) => {
      try {
        const res = calcular({ ancho: a, alto: h, color, tipoVidrio });

        resultados.push({ input: { m, color }, output: res });

        console.log(`✔ ${m} ${color}`);
      } catch (e) {
        console.log(`❌ ${m}`, e.message);
      }
    });
  });
});

fs.writeFileSync(
  path.join(process.cwd(), "rajas_herrero_test.json"),
  JSON.stringify(resultados, null, 2),
);
