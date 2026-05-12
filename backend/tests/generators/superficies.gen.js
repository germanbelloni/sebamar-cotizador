// backend/tests/generators/superficies.generator.js

const fs = require("fs");

const path = require("path");

const { fromRoot } = require("../../utils/path");

const calcularsuperficies = require(
  fromRoot("wrappers/superficies/calcularsuperficies"),
);

// =========================
// ⚙ CONFIG
// =========================

const CONFIG = {
  tipos: ["pano_fijo", "premarco", "contramarco"],

  medidas: [
    {
      ancho: 100,
      alto: 100,
    },

    {
      ancho: 150,
      alto: 120,
    },

    {
      ancho: 200,
      alto: 150,
    },
  ],

  lineas: ["herrero", "modena"],

  colores: ["blanco", "negro"],

  vidrios: ["3mm", "4mm", "3+3", "dvh"],

  perfiles: ["amarilla"],
};

// =========================
// 📦 RESULTADOS
// =========================

const resultados = [];

// =========================
// 📁 OUTPUT
// =========================

const outputDir = fromRoot("backend/tests/generated/superficies");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, {
    recursive: true,
  });
}

// =========================
// 🚀 GENERADOR
// =========================

CONFIG.tipos.forEach((tipo) => {
  CONFIG.medidas.forEach(({ ancho, alto }) => {
    CONFIG.colores.forEach((color) => {
      CONFIG.lineas.forEach((linea) => {
        CONFIG.vidrios.forEach((tipoVidrio) => {
          CONFIG.perfiles.forEach((perfil) => {
            const input = {
              tipo,

              ancho,

              alto,

              linea,

              color,

              perfil,
            };

            // 🪟 SOLO PAÑO FIJO
            if (tipo === "pano_fijo") {
              input.tipoVidrio = tipoVidrio;
            }

            try {
              const output = calcularsuperficies(input);

              resultados.push({
                ok: true,

                input,

                output,
              });

              console.log(`✔ ${tipo} | ${ancho}x${alto} | ${linea}`);
            } catch (error) {
              resultados.push({
                ok: false,

                input,

                error: error.message,
              });

              console.log(`❌ ${tipo} | ${ancho}x${alto}`);

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

const fileName = `superficies_${Date.now()}.json`;

const outputPath = path.join(outputDir, fileName);

fs.writeFileSync(
  outputPath,

  JSON.stringify(resultados, null, 2),
);

// =========================
// ✅ LOG
// =========================

console.log(`\n✅ Generator superficies OK`);

console.log(`📁 Archivo: ${outputPath}`);

console.log(`📦 Casos generados: ${resultados.length}`);
