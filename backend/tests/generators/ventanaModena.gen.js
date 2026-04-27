const fs = require("fs");
const path = require("path");

const { fromRoot } = require("../../utils/path");

// 📦 DATA
const data = require(fromRoot("frontend/data/productos/ventanas_modena.json"));

// 🧠 SERVICE
const calcularVentana = require(
  fromRoot("backend/services/ventanas/calcularVentana"),
);

// 🎯 CONFIG
const COLORES = ["blanco", "negro", "bronce", "simil madera"];
const VIDRIOS = ["3mm", "4mm", "5mm", "3+3", "dvh"];

// 📦 RESULTADOS
let resultados = [];

// =========================
// 📁 OUTPUT CONFIG
// =========================
const outputDir = path.join(
  process.cwd(),
  "backend",
  "tests",
  "output",
  "ventanaModena",
);

// crear carpeta si no existe
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// =========================
// 🚀 GENERADOR
// =========================
console.log("\n🧪 GENERANDO TEST MASIVO MODENA...\n");

Object.keys(data.medidas).forEach((medida) => {
  COLORES.forEach((color) => {
    VIDRIOS.forEach((tipoVidrio) => {
      const input = {
        medida,
        color,
        tipoVidrio,
        linea: "modena",
      };

      try {
        const res = calcularVentana(input);

        resultados.push({
          input,
          output: res,
        });

        console.log(`✔ ${medida} | ${color} | ${tipoVidrio}`);
      } catch (e) {
        resultados.push({
          input,
          error: e.message,
        });

        console.log(`❌ ${medida} | ${color} | ${tipoVidrio}`);
        console.log("   👉", e.message);
      }
    });
  });
});

// =========================
// 💾 SAVE
// =========================
const fileName = `ventana_modena_${Date.now()}.json`;

fs.writeFileSync(
  path.join(outputDir, fileName),
  JSON.stringify(resultados, null, 2),
);

console.log(`\n✅ JSON generado en: ${outputDir}\\${fileName}\n`);
