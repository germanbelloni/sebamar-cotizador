// backend/tests/generators/puertaYMedia.generator.js

const fs = require("fs");

const path = require("path");

// 🔧 PATH
const { fromRoot } = require("../../utils/path");

// 🧠 WRAPPER
const calcularPuerta = require(fromRoot("wrappers/puertas/calcularPuerta.js"));

// =========================
// ⚙ CONFIG
// =========================

const CONFIG = {
  colores: ["blanco", "negro", "bronce", "simil madera"],

  vidrios: ["4mm", "3+3", "fantasia", "esmerilado"],

  lineas: ["herrero", "modena"],

  medida: "120x200",

  perfil: "amarilla",
};

// =========================
// 📦 RESULTADOS
// =========================

const resultados = [];

// =========================
// 📁 OUTPUT
// =========================

const outputDir = fromRoot("backend/tests/generated/puertas");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, {
    recursive: true,
  });
}

// =========================
// 🔍 HELPERS
// =========================

function loadData(linea) {
  return require(fromRoot(`frontend/data/productos/puertas_${linea}.json`));
}

function getModelosPuerta(data) {
  if (!data?.modelos) {
    throw new Error("modelos no existe");
  }

  return Object.keys(data.modelos);
}

function getModelosMedia(data, linea) {
  if (linea === "herrero") {
    const dataMedias = require(
      fromRoot("frontend/data/productos/puertas_media_herrero.json"),
    );

    return Object.keys(dataMedias.medias || {});
  }

  return Object.keys(data.modelos || {});
}

// =========================
// 🚀 GENERADOR
// =========================

function generar() {
  const { colores, vidrios, lineas, medida, perfil } = CONFIG;

  lineas.forEach((linea) => {
    let data;

    let modelosPuerta;

    let modelosMedia;

    try {
      data = loadData(linea);

      modelosPuerta = getModelosPuerta(data);

      modelosMedia = getModelosMedia(data, linea);
    } catch (error) {
      console.log(`❌ ${error.message}`);

      return;
    }

    console.log(`\n🔧 LINEA: ${linea}`);

    colores.forEach((color) => {
      modelosPuerta.forEach((modeloPuerta) => {
        modelosMedia.forEach((modeloMedia) => {
          vidrios.forEach((tipoVidrio) => {
            const input = {
              tipo: "puerta_y_media",

              linea,

              modeloPuerta,

              modeloMedia,

              medida,

              color,

              tipoVidrio,

              perfil,
            };

            try {
              const output = calcularPuerta(input);

              resultados.push({
                ok: true,

                input,

                output,
              });

              console.log(
                `✔ ${linea} → ${modeloPuerta} + ${modeloMedia} → $${output?.precioVenta}`,
              );
            } catch (error) {
              resultados.push({
                ok: false,

                input,

                error: error.message,
              });

              console.log(`❌ ${linea} ${modeloPuerta} + ${modeloMedia}`);

              console.log(`👉 ${error.message}`);
            }
          });
        });
      });
    });
  });
}

// =========================
// 🚀 RUN
// =========================

generar();

// =========================
// 💾 SAVE
// =========================

const fileName = `puerta_y_media_${Date.now()}.json`;

const outputPath = path.join(outputDir, fileName);

fs.writeFileSync(
  outputPath,

  JSON.stringify(resultados, null, 2),
);

// =========================
// ✅ LOG
// =========================

console.log(`\n✅ Generator Puerta y Media OK`);

console.log(`📁 Archivo: ${outputPath}`);

console.log(`📦 Casos generados: ${resultados.length}`);
