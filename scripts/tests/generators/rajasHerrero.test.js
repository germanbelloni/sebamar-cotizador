const fs = require("fs");

// 🔧 PATH HELPER
const { fromRoot } = require("../../../utils/path");

// 📦 DATA
const data = require(fromRoot("frontend/data/productos/rajas_herrero.json"));

// 🧠 SERVICE
const calcularRaja = require(fromRoot("services/rajas/calcularRaja.js"));

// 🎯 VARIABLES
const colores = ["blanco", "negro", "bronce", "simil madera"];
const vidrios = ["3mm", "4mm", "5mm", "esmerilado", "fantasia", "3+3"];
const perfil = "amarilla";

// 📦 RESULTADO FINAL
let resultados = [];

colores.forEach((color) => {
  Object.keys(data.medidas).forEach((medida) => {
    try {
      let resultadoVidrios = {};

      vidrios.forEach((vidrio) => {
        const r = calcularRaja({
          medida,
          tipoVidrio: vidrio,
          color,
          perfil,
        });

        resultadoVidrios[vidrio] = r.total;
      });

      resultados.push({
        input: {
          medida,
          color,
          perfil,
          linea: "herrero",
        },
        output: {
          vidrios: resultadoVidrios,
        },
      });

      console.log(`✔ ${medida} (${color}) → OK`);
    } catch (error) {
      resultados.push({
        input: {
          medida,
          color,
          perfil,
          linea: "herrero",
        },
        error: error.message,
      });

      console.log(`❌ ERROR → medida:${medida} color:${color}`);
      console.log("   👉", error.message);
    }
  });
});

// 💾 GUARDAR JSON
const nombreArchivo = `rajas_herrero_${Date.now()}.json`;

const outputDir = fromRoot("scripts/tests/outputs/rajas_herrero");

// crear carpeta si no existe
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(
  fromRoot("scripts/tests/outputs/rajas_herrero", nombreArchivo),
  JSON.stringify(resultados, null, 2),
);

console.log(`\n✅ JSON generado: ${nombreArchivo}`);
