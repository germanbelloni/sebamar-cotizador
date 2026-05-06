// backend/tests/generators/rajasHerrero.generator.js

const fs = require("fs");

const path = require("path");

const { fromRoot } = require("../../utils/path");

const calcularRajaHerrero = require(
  fromRoot("wrappers/rajas/calcularRajaHerrero"),
);

const data = require(fromRoot("frontend/data/productos/rajas_herrero.json"));

// =========================
// ⚙ CONFIG
// =========================

const CONFIG = {
  colores: ["blanco", "negro", "simil madera"],

  vidrios: ["4mm", "3+3", "4+4", "dvh"],

  modelos: ["raja", "brazo", "volcable"],

  perfiles: ["amarilla"],

  bisagras: ["izquierda", "derecha"],
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
    CONFIG.vidrios.forEach((tipoVidrio) => {
      CONFIG.modelos.forEach((modelo) => {
        CONFIG.perfiles.forEach((perfil) => {
          CONFIG.bisagras.forEach((bisagra) => {
            const input = {
              ancho,

              alto,

              color,

              tipoVidrio,

              modelo,

              perfil,

              bisagra,
            };

            try {
              const output = calcularRajaHerrero(input);

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

// =========================
// 💾 SAVE
// =========================

const fileName = `rajas_herrero_${Date.now()}.json`;

const outputPath = path.join(outputDir, fileName);

fs.writeFileSync(
  outputPath,

  JSON.stringify(resultados, null, 2),
);

// =========================
// ✅ LOG
// =========================

console.log(`\n✅ Generator Rajas Herrero OK`);

console.log(`📁 Archivo: ${outputPath}`);

console.log(`📦 Casos generados: ${resultados.length}`);
