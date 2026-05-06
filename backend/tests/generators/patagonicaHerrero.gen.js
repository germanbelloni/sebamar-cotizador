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
  medidas: ["120x100", "150x100", "200x100"],

  tipos: ["1_raja", "2_rajas"],

  colores: ["blanco", "negro", "simil madera"],

  rajas: [
    {
      ancho: 40,
      tipoVidrio: "4mm",
    },

    {
      ancho: 50,
      tipoVidrio: "4+4",
    },

    {
      ancho: 60,
      tipoVidrio: "dvh",
    },
  ],

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
      CONFIG.rajas.forEach((raja) => {
        CONFIG.aperturas.forEach((tipoApertura) => {
          CONFIG.lados.forEach((ladoApertura) => {
            const input = {
              medidaTotal,

              tipo,

              raja,

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

              console.log(`✔ ${medidaTotal} | ${tipo} | ${color}`);
            } catch (error) {
              resultados.push({
                ok: false,

                input,

                error: error.message,
              });

              console.log(`❌ ${medidaTotal} | ${tipo}`);
            }
          });
        });
      });
    });
  });
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

fs.writeFileSync(
  outputPath,

  JSON.stringify(resultados, null, 2),
);

// =========================
// ✅ LOG
// =========================

console.log(`\n✅ Generator Patagónica Herrero OK`);

console.log(`📁 Archivo: ${outputPath}`);

console.log(`📦 Casos generados: ${resultados.length}`);
