// backend/tests/generators/puertaPlaca.generator.js

const fs = require("fs");

const path = require("path");

const { fromRoot } = require("../../utils/path");

const calcularPuertaPlaca = require(
  fromRoot("wrappers/placas/calcularPuertaPlaca"),
);

const data = require(fromRoot("frontend/data/productos/puertas_placa.json"));

// =========================
// 📦 RESULTADOS
// =========================

const resultados = [];

// =========================
// 📁 OUTPUT
// =========================

const outputDir = fromRoot("backend/tests/generated/placas");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, {
    recursive: true,
  });
}

// =========================
// 🚀 GENERADOR
// =========================

Object.keys(data).forEach((tipo) => {
  Object.keys(data[tipo]).forEach((modelo) => {
    Object.keys(data[tipo][modelo]).forEach((medida) => {
      Object.keys(data[tipo][modelo][medida]).forEach((marco) => {
        let input = null;

        try {
          const [ancho, alto] = medida.split("x").map(Number);

          input = {
            ancho,

            alto,

            tipo,

            modelo,

            marco,
          };

          const output = calcularPuertaPlaca(input);

          resultados.push({
            ok: true,

            input,

            output,
          });

          console.log(
            `✔ ${tipo} | ${modelo} | ${medida} → $${output?.precioVenta}`,
          );
        } catch (error) {
          resultados.push({
            ok: false,

            input: input || {
              tipo,

              modelo,

              medida,

              marco,
            },

            error: error.message,
          });

          console.log(`❌ ${tipo} | ${modelo} | ${medida}`);

          console.log(`👉 ${error.message}`);
        }
      });
    });
  });
});

// =========================
// 💾 SAVE
// =========================

const fileName = `puertaPlaca_${Date.now()}.json`;

const outputPath = path.join(outputDir, fileName);

fs.writeFileSync(
  outputPath,

  JSON.stringify(resultados, null, 2),
);

// =========================
// ✅ LOG
// =========================

console.log(`\n✅ Generator Puerta Placa OK`);

console.log(`📁 Archivo: ${outputPath}`);

console.log(`📦 Casos generados: ${resultados.length}`);
