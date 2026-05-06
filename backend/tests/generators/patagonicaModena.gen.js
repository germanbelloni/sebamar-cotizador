// backend/tests/generators/patagonicaModena.generator.js

const fs = require("fs");

const path = require("path");

const { fromRoot } = require("../../utils/path");

const calcularPatagonicaModena = require(
  fromRoot("wrappers/patagonicas/calcularPatagonicaModena"),
);

// =========================
// ⚙ CONFIG
// =========================

const CONFIG = {
  medidas: ["100x60", "150x100", "200x100"],

  colores: ["blanco", "negro", "simil madera"],

  cantidadesRajas: [1, 2],

  vidrios: ["4mm", "4+4", "dvh"],

  aperturas: ["abrir", "oscilobatiente"],

  lados: ["derecha", "izquierda"],

  perfiles: ["amarilla"],
};

// =========================
// 🚀 GENERAR
// =========================

const resultados = [];

CONFIG.medidas.forEach((medida) => {
  CONFIG.colores.forEach((color) => {
    CONFIG.cantidadesRajas.forEach((cantidadRajas) => {
      CONFIG.vidrios.forEach((tipoVidrio) => {
        CONFIG.aperturas.forEach((tipoApertura) => {
          CONFIG.lados.forEach((ladoApertura) => {
            CONFIG.perfiles.forEach((perfil) => {
              const input = {
                medida,

                cantidadRajas,

                tipoVidrio,

                color,

                perfil,

                tipoApertura,

                ladoApertura,
              };

              try {
                const output = calcularPatagonicaModena(input);

                resultados.push({
                  ok: true,

                  input,

                  output,
                });

                console.log(`✔ ${medida} | ${cantidadRajas} rajas | ${color}`);
              } catch (error) {
                resultados.push({
                  ok: false,

                  input,

                  error: error.message,
                });

                console.log(`❌ ${medida} | ${cantidadRajas} rajas`);
              }
            });
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

const fileName = `patagonica_modena_${Date.now()}.json`;

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

console.log(`\n✅ Generator Patagónica Modena OK`);

console.log(`📁 Archivo: ${outputPath}`);

console.log(`📦 Casos generados: ${resultados.length}`);
