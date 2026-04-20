const fs = require("fs");

// 🔧 PATH HELPER
const { fromRoot } = require("../../../utils/path");

// 📦 DATA
const data = require(fromRoot("frontend/data/productos/rajas_modena.json"));

// 🧠 SERVICE (EL TUYO REAL)
const calcularRaja = require(
  fromRoot("services/rajas/calcularRaja.js"),
);

// 🎯 VARIABLES
const colores = ["blanco", "negro", "bronce", "simil madera"];

// 📦 RESULTADO FINAL
let resultados = [];

Object.keys(data.medidas).forEach((medida) => {
  const info = data.medidas[medida];

  const vidrios = Object.keys(info.vidrios || {});

  colores.forEach((color) => {
    vidrios.forEach((tipoVidrio) => {
      [false, true].forEach((conCamara) => {
        try {
          // 🧠 EXTRA POR CÁMARA (DVH)
          const extraVidrio = conCamara ? info.camara || 0 : 0;

          const result = calcularRaja({
            medida,
            tipoVidrio,
            color,
            linea: "modena",
            extraVidrio,
          });

          resultados.push({
            input: {
              medida,
              color,
              tipoVidrio,
              conCamara,
            },
            output: result,
          });

          console.log(
            `✔ ${medida} (${color}) vidrio:${tipoVidrio} camara:${conCamara} → ${result.total}`,
          );
        } catch (error) {
          resultados.push({
            input: {
              medida,
              color,
              tipoVidrio,
              conCamara,
            },
            error: error.message,
          });

          console.log(
            `❌ ERROR → ${medida} (${color}) vidrio:${tipoVidrio} camara:${conCamara}`,
          );
          console.log("   👉", error.message);
        }
      });
    });
  });
});

// 💾 GUARDAR JSON
const nombreArchivo = `output_rajas_modena_${Date.now()}.json`;

fs.writeFileSync(
  fromRoot("scripts/tests/outputs/rajas_modena", nombreArchivo),
  JSON.stringify(resultados, null, 2),
);

console.log(`\n✅ JSON generado: ${nombreArchivo}`);
