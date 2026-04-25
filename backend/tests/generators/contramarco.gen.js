const fs = require("fs");
const path = require("path");

// 📌 IMPORTANTE: evitar process.cwd para imports internos
const calcularContramarco = require(
  path.join(
    __dirname,
    "..",
    "..",
    "services",
    "superficies",
    "calcularContramarco",
  ),
);

// =========================
// 🧪 CASOS
// =========================
const casos = [
  { ancho: 100, alto: 100 },
  { ancho: 150, alto: 120 },
  { ancho: 200, alto: 150 },
];

const colores = ["blanco", "negro"];

// =========================
// 🔄 GENERAR
// =========================
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

// =========================
// 📁 OUTPUT
// =========================

// ✔ acá sí process.cwd está perfecto (es script)
const baseOutput =
  process.env.OUTPUT_DIR || path.join(process.cwd(), "tests", "output");

const folderName = path.basename(__filename).replace(".gen.js", "");
const outputDir = path.join(baseOutput, folderName);

// crear carpeta si no existe
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const outputFile = path.join(outputDir, "contramarco.json");

fs.writeFileSync(outputFile, JSON.stringify(resultados, null, 2));

// =========================
// 📊 LOG
// =========================
console.log("📊 CONTRAMARCO");
console.log("Casos generados:", resultados.length);
console.log("Archivo:", outputFile);


