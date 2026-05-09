// backend/tests/generators/ventanaHerrero.generator.js

const fs = require("fs");

const path = require("path");

// 🔧 PATH
const { fromRoot } = require("../../utils/path");

// 🧠 WRAPPER
const calcularVentanaHerrero = require(
  fromRoot("wrappers/ventanas/calcularVentanaHerrero"),
);

// 📦 DATA
const data = require(fromRoot("backend/data/productos/ventanas_herrero.json"));

// =========================
// ⚙ CONFIG
// =========================

const CONFIG = {
  colores: ["blanco", "negro", "bronce", "simil madera"],

  perfiles: ["amarilla"],

  guias: [true, false],

  mosquiteros: [true, false],

  cortinas: [null, "pvc", "aluminio"],

  cajonBlock: [true, false],
};

// =========================
// 📦 RESULTADOS
// =========================

const resultados = [];

// =========================
// 📁 OUTPUT
// =========================

const outputDir = fromRoot("backend/tests/generated/ventanas");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, {
    recursive: true,
  });
}

// =========================
// 🔍 HELPERS
// =========================

function getMedidas() {
  return Object.keys(data.medidas || {});
}

// =========================
// 🚀 GENERADOR
// =========================

function generar() {
  const medidas = getMedidas();

  medidas.forEach((medida) => {
    const partes = medida.split("x").map(Number);

    if (partes.length !== 2) {
      return;
    }

    const [ancho, alto] = partes;

    if (!ancho || !alto) {
      return;
    }

    CONFIG.colores.forEach((color) => {
      CONFIG.perfiles.forEach((perfil) => {
        CONFIG.guias.forEach((guia) => {
          CONFIG.mosquiteros.forEach((mosquitero) => {
            CONFIG.cortinas.forEach((cortina) => {
              CONFIG.cajonBlock.forEach((cajonBlock) => {
                const input = {
                  ancho,

                  alto,

                  color,

                  guia,

                  mosquitero,

                  cortina,

                  cajonBlock,

                  perfil,
                };

                try {
                  const output = calcularVentanaHerrero(input);

                  resultados.push({
                    ok: true,

                    input,

                    output,
                  });

                  console.log(`✔ herrero | ${medida} | ${color}`);
                } catch (error) {
                  resultados.push({
                    ok: false,

                    input,

                    error: error.message,
                  });

                  console.log(`❌ herrero | ${medida} | ${color}`);

                  console.log(`👉 ${error.message}`);
                }
              });
            });
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

const fileName = `ventana_herrero_${Date.now()}.json`;

const outputPath = path.join(outputDir, fileName);

fs.writeFileSync(
  outputPath,

  JSON.stringify(resultados, null, 2),
);

// =========================
// ✅ LOG
// =========================

console.log(`\n✅ Generator Ventana Herrero OK`);

console.log(`📁 Archivo: ${outputPath}`);

console.log(`📦 Casos generados: ${resultados.length}`);
