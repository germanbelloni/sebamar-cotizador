const fs = require("fs");
const path = require("path");

const calcularPremarco = require("../services/calcularPremarco");

const casos = [
  { ancho: 100, alto: 100 },
  { ancho: 150, alto: 120 },
  { ancho: 200, alto: 150 },
];

const resultados = [];

casos.forEach((c) => {
  try {
    const res = calcularPremarco(c);

    resultados.push({
      ...c,
      total: res.total,
    });
  } catch (err) {
    resultados.push({
      ...c,
      error: err.message,
    });
  }
});

const output = path.join(process.cwd(), "tests/output/premarco.json");

fs.writeFileSync(output, JSON.stringify(resultados, null, 2));

console.log("✅ premarco generado:", resultados.length);
