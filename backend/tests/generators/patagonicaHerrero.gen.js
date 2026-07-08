// backend/tests/generators/patagonicaHerrero.generator.js

const fs = require("fs");
const path = require("path");

const { fromRoot } = require("../../utils/path");

const calcularPatagonicaHerrero = require(
  fromRoot("wrappers/patagonicas/calcularPatagonicaHerrero"),
);

// =========================
// ⚙ CONFIG
// =========================

const CONFIG = {
  medidas: ["120x100", "150x100", "200x100", "240x150"],

  tipos: ["1_raja", "2_rajas"],

  colores: ["blanco", "negro", "simil madera"],

  anchosRaja: [40, 50, 60],

  vidrios: ["4mm", "4+4", "dvh"],

  aperturas: ["abrir"],

  lados: ["derecha", "izquierda"],
};

// =========================
// 🚀 GENERAR
// =========================

const resultados = [];

CONFIG.tipos.forEach((tipo) => {
  CONFIG.medidas.forEach((medidaTotal) => {
    CONFIG.colores.forEach((color) => {
      CONFIG.anchosRaja.forEach((ancho) => {
        CONFIG.vidrios.forEach((tipoVidrio) => {
          CONFIG.aperturas.forEach((tipoApertura) => {
            CONFIG.lados.forEach((ladoApertura) => {
              const input = {
                medidaTotal,

                tipo,

                raja: {
                  ancho,
                  tipoVidrio,
                },

                color,

                tipoApertura,

                ladoApertura,
              };

              try {
                const output = calcularPatagonicaHerrero(input);

                resultados.push({
                  ok: true,
                  input,
                  output,
                });

                console.log(
                  `✔ ${medidaTotal} | ${tipo} | ${ancho} | ${tipoVidrio}`,
                );
              } catch (error) {
                resultados.push({
                  ok: false,
                  input,
                  error: error.message,
                });

                console.log(
                  `❌ ${medidaTotal} | ${tipo} | ${ancho} | ${tipoVidrio}`,
                );

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
    medidaTotal: "100x100",
    tipo: "2_rajas",
    raja: {
      ancho: 60,
      tipoVidrio: "dvh",
    },
    color: "blanco",
    tipoApertura: "abrir",
    ladoApertura: "derecha",
  },
];

casosInvalidos.forEach((input) => {
  try {
    const output = calcularPatagonicaHerrero(input);

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
// 📁 OUTPUT
// =========================

const outputDir = fromRoot("backend/tests/generated/patagonicas");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, {
    recursive: true,
  });
}

const fileName = `patagonica_herrero_${Date.now()}.json`;

const outputPath = path.join(outputDir, fileName);

// =========================
// 💾 SAVE
// =========================

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

console.log("✅ Generator Patagónica Herrero OK");

console.log("================================");

console.log(`📁 Archivo: ${outputPath}`);

console.log(`📦 Casos generados: ${resultados.length}`);

console.log(`✅ OK: ${ok}`);

console.log(`❌ Errores: ${errores}`);

console.log("================================");
