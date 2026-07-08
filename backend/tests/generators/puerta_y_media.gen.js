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

  medidas: ["120x200", "130x200"],

  perfiles: ["amarilla"],
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
  return require(fromRoot(`backend/data/productos/puertas_${linea}.json`));
}

function getModelosPuerta(data) {
  return Object.keys(data?.modelos || {});
}

function getModelosMedia(data, linea) {
  if (linea === "herrero") {
    const dataMedias = require(
      fromRoot("backend/data/productos/puertas_media_herrero.json"),
    );

    return Object.keys(dataMedias.medias || {});
  }

  return Object.keys(data.modelos || {});
}

// =========================
// 🚀 GENERADOR
// =========================

CONFIG.lineas.forEach((linea) => {
  let data;
  let modelosPuerta;
  let modelosMedia;

  try {
    data = loadData(linea);

    modelosPuerta = getModelosPuerta(data);

    modelosMedia = getModelosMedia(data, linea);
  } catch (error) {
    resultados.push({
      ok: false,
      linea,
      error: error.message,
    });

    return;
  }

  CONFIG.medidas.forEach((medida) => {
    CONFIG.colores.forEach((color) => {
      modelosPuerta.forEach((modeloPuerta) => {
        modelosMedia.forEach((modeloMedia) => {
          CONFIG.vidrios.forEach((tipoVidrio) => {
            CONFIG.perfiles.forEach((perfil) => {
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
                  `✔ ${linea} | ${medida} | ${modeloPuerta} + ${modeloMedia}`,
                );
              } catch (error) {
                resultados.push({
                  ok: false,
                  input,
                  error: error.message,
                });

                console.log(`❌ ${linea} | ${modeloPuerta} + ${modeloMedia}`);

                console.log(`👉 ${error.message}`);
              }
            });
          });
        });
      });
    });
  });
});

// =========================
// 🧪 CASOS INVÁLIDOS
// =========================

const casosInvalidos = [
  {
    tipo: "puerta_y_media",
    linea: "herrero",
    modeloPuerta: "modelo_inexistente",
    modeloMedia: "v/entero",
    medida: "120x200",
    color: "blanco",
    tipoVidrio: "4mm",
    perfil: "amarilla",
  },

  {
    tipo: "puerta_y_media",
    linea: "herrero",
    modeloPuerta: "modelo_1",
    modeloMedia: "modelo_inexistente",
    medida: "120x200",
    color: "blanco",
    tipoVidrio: "4mm",
    perfil: "amarilla",
  },

  {
    tipo: "puerta_y_media",
    linea: "modena",
    modeloPuerta: "modelo_1",
    modeloMedia: "modelo_1",
    medida: "999x999",
    color: "blanco",
    tipoVidrio: "4mm",
    perfil: "amarilla",
  },
];

casosInvalidos.forEach((input) => {
  try {
    const output = calcularPuerta(input);

    resultados.push({
      ok: true,
      input,
      output,
    });
  } catch (error) {
    resultados.push({
      ok: false,
      input,
      error: error.message,
    });
  }
});

// =========================
// 💾 SAVE
// =========================

const fileName = `puerta_y_media_${Date.now()}.json`;

const outputPath = path.join(outputDir, fileName);

fs.writeFileSync(outputPath, JSON.stringify(resultados, null, 2));

// =========================
// 📊 STATS
// =========================

const ok = resultados.filter((r) => r.ok).length;

const errores = resultados.length - ok;

// =========================
// ✅ LOG
// =========================

console.log("\n================================");

console.log("✅ Generator Puerta y Media OK");

console.log("================================");

console.log(`📁 Archivo: ${outputPath}`);

console.log(`📦 Casos generados: ${resultados.length}`);

console.log(`✅ OK: ${ok}`);

console.log(`❌ Errores: ${errores}`);

console.log("================================");
