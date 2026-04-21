const fs = require("fs");

// 🔧 PATH HELPER
const { fromRoot } = require("../../../utils/path");

// 🧠 SERVICE
const calcularPuerta = require(fromRoot("services/puertas/calcularPuerta.js"));

// 🎯 VARIABLES
const colores = ["blanco", "negro", "bronce", "simil madera"];
const vidrios = ["4mm", "3+3", "fantasia", "esmerilado"];

const lineas = ["herrero", "modena"];

let resultados = [];

lineas.forEach((linea) => {
  const data = require(
    fromRoot(`frontend/data/productos/puertas_${linea}.json`),
  );

  const modelosPuerta = Object.keys(data.modelos || {});
  const modelosMedia =
    linea === "herrero"
      ? Object.keys(data.medias || {})
      : Object.keys(data.modelos || {}); // 🔥 modena usa mismos modelos

  console.log(`\n🔧 LINEA: ${linea}`);
  console.log("modelosPuerta:", modelosPuerta.length);
  console.log("modelosMedia:", modelosMedia.length);

  colores.forEach((color) => {
    modelosPuerta.forEach((modeloPuerta) => {
      modelosMedia.forEach((modeloMedia) => {
        vidrios.forEach((tipoVidrio) => {
          try {
            const result = calcularPuerta({
              tipo: "puerta_y_media",
              linea,
              modeloPuerta,
              modeloMedia,
              medida: "120x200",
              color,
              tipoVidrio,
              perfil: "amarilla",
            });

            resultados.push({
              input: {
                tipo: "puerta_y_media",
                linea,
                modeloPuerta,
                modeloMedia,
                medida: "120x200",
                color,
                tipoVidrio,
                perfil: "amarilla",
              },
              output: result,
            });

            console.log(
              `✔ ${linea} → ${modeloPuerta} + ${modeloMedia} (${color}) → ${result.total}`,
            );
          } catch (error) {
            resultados.push({
              input: {
                tipo: "puerta_y_media",
                linea,
                modeloPuerta,
                modeloMedia,
                medida: "120x200",
                color,
                tipoVidrio,
                perfil: "amarilla",
              },
              error: error.message,
            });

            console.log(`❌ ERROR → ${linea} ${modeloPuerta} + ${modeloMedia}`);
            console.log("   👉", error.message);
          }
        });
      });
    });
  });
});

// 💾 GUARDAR JSON
const nombreArchivo = `puerta_y_media_${Date.now()}.json`;

const outputDir = fromRoot("scripts/tests/outputs/puertas_y_media");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(
  fromRoot("scripts/tests/outputs/puertas_y_media", nombreArchivo),
  JSON.stringify(resultados, null, 2),
);

console.log(`\n✅ JSON generado: ${nombreArchivo}`);
