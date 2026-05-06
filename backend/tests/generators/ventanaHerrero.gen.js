const fs = require("fs");
const path = require("path");

// 🔧 PATH HELPER
const { fromRoot } = require("../../utils/path");

// 🧠 WRAPPER (NO SERVICE)
const calcularVentanaHerrero = require(
  fromRoot("wrappers/ventanas/calcularVentanaHerrero"),
);

// 📦 DATA
const data = require(fromRoot("frontend/data/productos/ventanas_herrero.json"));

// 🎯 CONFIG
const CONFIG = {
  colores: ["blanco", "negro", "bronce", "simil madera"],
  perfil: "amarilla",
};

// 📦 RESULTADOS
let resultados = [];

// 📁 OUTPUT
const baseOutput =
  process.env.OUTPUT_DIR || path.join(process.cwd(), "tests", "output");

const folderName = path.basename(__filename).replace(".gen.js", "");
const outputDir = path.join(baseOutput, folderName);

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 🔍 HELPERS
function getMedidas() {
  return Object.keys(data.medidas || {});
}

// 🔁 GENERADOR
function generar() {
  const { colores, perfil } = CONFIG;

  const medidas = getMedidas();

  medidas.forEach((medida) => {
    const [ancho, alto] = medida.split("x").map(Number);

    colores.forEach((color) => {
      const input = {
        ancho,
        alto,
        color,
        guia: true,
        mosquitero: true,
        perfil,
      };

      try {
        const result = calcularVentanaHerrero(input);

        resultados.push({ input, output: result });

        console.log(
          `✔ herrero | ${medida} | ${color} → $${result?.precioVenta} (costo: ${result?.costo})`,
        );
      } catch (err) {
        resultados.push({ input, error: err.message });

        console.log(`❌ herrero | ${medida} | ${color}`);
        console.log("   👉", err.message);
      }
    });
  });
}

// 🚀 RUN
generar();

// 💾 SAVE
const nombreArchivo = `ventana_herrero_${Date.now()}.json`;

fs.writeFileSync(
  path.join(outputDir, nombreArchivo),
  JSON.stringify(resultados, null, 2),
);

console.log(`\n✅ JSON generado: ${nombreArchivo}`);
