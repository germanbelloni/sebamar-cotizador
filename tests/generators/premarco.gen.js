const fs = require("fs");
const path = require("path");

const calcularPremarco = require(
  path.join(process.cwd(), "services", "superficies", "calcularPremarco"),
);

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

// 📁 OUTPUT
const baseOutput =
  process.env.OUTPUT_DIR || path.join(process.cwd(), "tests", "output");

const folderName = path.basename(__filename).replace(".gen.js", "");
const outputDir = path.join(baseOutput, folderName);

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const outputFile = path.join(outputDir, "premarco.json");

fs.writeFileSync(outputFile, JSON.stringify(resultados, null, 2));

console.log("✅ premarco generado:", resultados.length);
