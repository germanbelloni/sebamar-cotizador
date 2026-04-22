const fs = require("fs");
const path = require("path");

const calcularContramarco = require("../services/calcularContramarco");

const casos = [
  { ancho: 100, alto: 100 },
  { ancho: 150, alto: 120 },
  { ancho: 200, alto: 150 },
];

const colores = ["blanco", "negro"];

const resultados = [];

casos.forEach((c) => {
  colores.forEach((color) => {
    try {
      const res = calcularContramarco({
        ...c,
        color,
      });

      resultados.push({
        ...c,
        color,
        total: res.total,
      });
    } catch (err) {
      resultados.push({
        ...c,
        color,
        error: err.message,
      });
    }
  });
});

const output = path.join(process.cwd(), "tests/output/contramarco.json");

fs.writeFileSync(output, JSON.stringify(resultados, null, 2));

console.log("✅ contramarco generado:", resultados.length);
