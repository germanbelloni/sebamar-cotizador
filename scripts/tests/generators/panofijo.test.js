const fs = require("fs");
const path = require("path");

const calcularPanoFijo = require("../services/calcularPanoFijo");

const casos = [
  { ancho: 100, alto: 100 },
  { ancho: 150, alto: 120 },
  { ancho: 200, alto: 150 },
];

const lineas = ["herrero", "modena"];
const colores = ["blanco", "negro"];
const vidrios = ["3mm", "4mm"];

const resultados = [];

casos.forEach((c) => {
  lineas.forEach((linea) => {
    colores.forEach((color) => {
      vidrios.forEach((vidrio) => {
        try {
          const res = calcularPanoFijo({
            ...c,
            linea,
            color,
            tipoVidrio: vidrio,
          });

          resultados.push({
            ...c,
            linea,
            color,
            vidrio,
            total: res.total,
          });
        } catch (err) {
          resultados.push({
            ...c,
            linea,
            color,
            vidrio,
            error: err.message,
          });
        }
      });
    });
  });
});

const output = path.join(process.cwd(), "tests/output/panoFijo.json");

fs.writeFileSync(output, JSON.stringify(resultados, null, 2));

console.log("✅ panoFijo generado:", resultados.length);
