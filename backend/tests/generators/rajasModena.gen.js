// backend/tests/generators/rajasModena.generator.js

const fs = require("fs");

const path = require("path");

const { fromRoot } = require("../../utils/path");

const calcularRajaModena = require(
  fromRoot("wrappers/rajas/calcularRajaModena"),
);

const data = require(fromRoot("frontend/data/productos/rajas_modena.json"));

// =========================
// ⚙ CONFIG
// =========================

const CONFIG = {
  colores: ["blanco", "negro", "simil madera"],

  vidrios: ["4mm", "3+3", "4+4", "dvh", "dvh_5_9_5"],

  modelos: ["raja", "oscilobatiente"],

  perfiles: ["amarilla"],

  bisagras: ["izquierda", "derecha"],

  mosquitero: [true, false],

  premarco: [true, false],

  contramarco: [true, false],
};

// =========================
// 📦 RESULTADOS
// =========================

const resultados = [];

// =========================
// 📁 OUTPUT
// =========================

const outputDir = fromRoot("backend/tests/generated/rajas");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, {
    recursive: true,
  });
}

// =========================
// 🚀 GENERADOR
// =========================

Object.keys(data.medidas).forEach((medida) => {
  const [ancho, alto] = medida.split("x").map(Number);

  CONFIG.colores.forEach((color) => {
    CONFIG.vidrios.forEach((vidrio) => {
      CONFIG.modelos.forEach((modelo) => {
        CONFIG.perfiles.forEach((perfil) => {
          CONFIG.bisagras.forEach((bisagra) => {
            CONFIG.mosquitero.forEach((mosquitero) => {
              CONFIG.premarco.forEach((premarco) => {
                CONFIG.contramarco.forEach((contramarco) => {
                  const input = {
                    ancho,

                    alto,

                    color,

                    vidrio,

                    modelo,

                    perfil,

                    bisagra,

                    mosquitero,

                    premarco,

                    contramarco,
                  };

                  try {
                    const output = calcularRajaModena(input);

                    resultados.push({
                      ok: true,

                      input,

                      output,
                    });

                    console.log(`✔ ${medida} | ${modelo} | ${color}`);
                  } catch (error) {
                    resultados.push({
                      ok: false,

                      input,

                      error: error.message,
                    });

                    console.log(`❌ ${medida} | ${modelo}`);

                    console.log(`👉 ${error.message}`);
                  }
                });
              });
            });
          });
        });
      });
    });
  });
});

// =========================
// 💾 SAVE
// =========================

const fileName = `rajas_modena_${Date.now()}.json`;

const outputPath = path.join(outputDir, fileName);

fs.writeFileSync(
  outputPath,

  JSON.stringify(resultados, null, 2),
);

// =========================
// ✅ LOG
// =========================

console.log(`\n✅ Generator Rajas Modena OK`);

console.log(`📁 Archivo: ${outputPath}`);

console.log(`📦 Casos generados: ${resultados.length}`);
