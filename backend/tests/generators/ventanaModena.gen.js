const fs = require("fs");
const path = require("path");

// 🔧 PATH HELPER
const { fromRoot } = require("../../utils/path");

// 🧠 WRAPPER
const calcularVentanaModena = require(
  fromRoot("wrappers/ventanas/calcularVentanaModena"),
);

// 📦 DATA
const data = require(fromRoot("frontend/data/productos/ventanas_modena.json"));

// 🎯 CONFIG
const CONFIG = {
  colores: ["blanco", "negro", "bronce", "simil madera"],
  vidrios: ["3mm", "4mm", "5mm", "3+3", "dvh"],
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
  const { colores, vidrios, perfil } = CONFIG;

  const medidas = getMedidas();

  medidas.forEach((medida) => {
    const [ancho, alto] = medida.split("x").map(Number);

    colores.forEach((color) => {
      vidrios.forEach((tipoVidrio) => {
        const input = {
          ancho,
          alto,
          color,
          tipoVidrio,
          perfil,
        };

        try {
          const result = calcularVentanaModena(input);

          resultados.push({ input, output: result });

          console.log(
            `✔ modena | ${medida} | ${color} | ${tipoVidrio} → $${result?.precioVenta}`,
          );
        } catch (err) {
          resultados.push({ input, error: err.message });

          console.log(`❌ modena | ${medida} | ${color} | ${tipoVidrio}`);
          console.log("   👉", err.message);
        }
      });
    });
  });
}

// 🚀 RUN
generar();

// 💾 SAVE
const nombreArchivo = `ventana_modena_${Date.now()}.json`;

fs.writeFileSync(
  path.join(outputDir, nombreArchivo),
  JSON.stringify(resultados, null, 2),
);

console.log(`\n✅ JSON generado: ${nombreArchivo}`);
