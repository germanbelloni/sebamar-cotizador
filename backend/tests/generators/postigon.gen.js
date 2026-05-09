// backend/tests/generators/postigones.generator.js

const fs = require("fs");

const path = require("path");

const { fromRoot } = require("../../utils/path");

const calcularPostigones = require(
  fromRoot("wrappers/postigones/calcularPostigones"),
);

const data = require(fromRoot("backend/data/productos/postigones.json"));

// =========================
// ⚙ CONFIG
// =========================

const CONFIG = {
  colores: ["blanco", "negro"],

  tipos: ["corredizo", "abrir"],

  perfiles: ["amarilla"],
};

// =========================
// 🚀 GENERAR
// =========================

const resultados = [];

Object.keys(data.medidas).forEach((medida) => {
  const [anchoRaw, altoRaw] = medida.split("x");

  const ancho = Number(String(anchoRaw).replace(",", "."));

  const alto = Number(String(altoRaw).replace(",", ".")) * 100;

  CONFIG.colores.forEach((color) => {
    CONFIG.tipos.forEach((tipo) => {
      CONFIG.perfiles.forEach((perfil) => {
        const input = {
          ancho,

          alto,

          tipo,

          color,

          perfil,
        };

        try {
          const output = calcularPostigones(input);

          resultados.push({
            ok: true,

            input: {
              medida,

              tipo,

              color,

              perfil,
            },

            output,
          });

          console.log(
            `✔ ${medida} | ${tipo} | ${color} → $${output?.precioVenta}`,
          );
        } catch (error) {
          resultados.push({
            ok: false,

            input: {
              medida,

              tipo,

              color,

              perfil,
            },

            error: error.message,
          });

          console.log(`❌ ${medida} | ${tipo} | ${color}`);
        }
      });
    });
  });
});

// =========================
// 📁 OUTPUT
// =========================

const outputDir = fromRoot("backend/tests/generated/postigones");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, {
    recursive: true,
  });
}

const fileName = `postigones_${Date.now()}.json`;

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

console.log(`\n✅ Generator Postigones OK`);

console.log(`📁 Archivo: ${outputPath}`);

console.log(`📦 Casos generados: ${resultados.length}`);
