// backend/tests/generators/ventanaModena.generator.js

const fs = require("fs");

const path = require("path");

// 🔧 PATH
const { fromRoot } = require("../../utils/path");

// 🧠 WRAPPER
const calcularVentanaModena = require(
  fromRoot("wrappers/ventanas/calcularVentanaModena"),
);

// 📦 DATA
const data = require(fromRoot("frontend/data/productos/ventanas_modena.json"));

// =========================
// ⚙ CONFIG
// =========================

const CONFIG = {
  colores: ["blanco", "negro", "bronce", "simil madera"],

  vidrios: ["3mm", "4mm", "5mm", "3+3", "dvh"],

  perfiles: ["amarilla"],

  mosquiteros: [true, false],

  premarcos: [true, false],

  contramarcos: [true, false],
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
    const [ancho, alto] = medida.split("x").map(Number);

    CONFIG.colores.forEach((color) => {
      CONFIG.vidrios.forEach((tipoVidrio) => {
        CONFIG.perfiles.forEach((perfil) => {
          CONFIG.mosquiteros.forEach((mosquitero) => {
            CONFIG.premarcos.forEach((premarco) => {
              CONFIG.contramarcos.forEach((contramarco) => {
                const input = {
                  ancho,

                  alto,

                  color,

                  tipoVidrio,

                  perfil,

                  mosquitero,

                  premarco,

                  contramarco,
                };

                try {
                  const output = calcularVentanaModena(input);

                  resultados.push({
                    ok: true,

                    input,

                    output,
                  });

                  console.log(
                    `✔ modena | ${medida} | ${color} | ${tipoVidrio}`,
                  );
                } catch (error) {
                  resultados.push({
                    ok: false,

                    input,

                    error: error.message,
                  });

                  console.log(
                    `❌ modena | ${medida} | ${color} | ${tipoVidrio}`,
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
}

// =========================
// 🚀 RUN
// =========================

generar();

// =========================
// 💾 SAVE
// =========================

const fileName = `ventana_modena_${Date.now()}.json`;

const outputPath = path.join(outputDir, fileName);

fs.writeFileSync(
  outputPath,

  JSON.stringify(resultados, null, 2),
);

// =========================
// ✅ LOG
// =========================

console.log(`\n✅ Generator Ventana Modena OK`);

console.log(`📁 Archivo: ${outputPath}`);

console.log(`📦 Casos generados: ${resultados.length}`);
