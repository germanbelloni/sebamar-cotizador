const fs = require("fs");
const path = require("path");

// 🔧 PATH HELPER
const { fromRoot } = require("../../../utils/path");

// 🧠 SERVICE
const calcularPuertaPlaca = require(
  fromRoot("services/placas/calcularPuertaPlaca.js"),
);

// 📦 DATA
const data = require(fromRoot("frontend/data/productos/puertas_placas.json"));

// 🎯 CONFIG
const perfil = "amarilla";

// 📦 RESULTADO FINAL
let resultados = [];

// 📁 ASEGURAR OUTPUT
const outputDir = fromRoot("scripts/tests/outputs/puertas_placa");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 🔁 RECORRIDO
Object.keys(data).forEach((tipo) => {
  const modelos = data[tipo];

  Object.keys(modelos).forEach((modelo) => {
    const medidas = modelos[modelo];

    Object.keys(medidas).forEach((medida) => {
      const marcos = medidas[medida];

      Object.keys(marcos).forEach((marco) => {
        try {
          const result = calcularPuertaPlaca({
            tipo,
            modelo,
            medida,
            marco,
            perfil,
          });

          resultados.push({
            input: {
              tipo,
              modelo,
              medida,
              marco,
              perfil,
            },
            output: result,
          });

          console.log(
            `✔ ${tipo} - ${modelo} - ${medida} - ${marco} → ${result.total}`,
          );
        } catch (error) {
          resultados.push({
            input: {
              tipo,
              modelo,
              medida,
              marco,
              perfil,
            },
            error: error.message,
          });

          console.log(`❌ ERROR → ${tipo} ${modelo} ${medida} ${marco}`);
          console.log("   👉", error.message);
        }
      });
    });
  });
});

// 💾 GUARDAR JSON
const nombreArchivo = `output_puertas_placa_${Date.now()}.json`;

fs.writeFileSync(
  path.join(outputDir, nombreArchivo),
  JSON.stringify(resultados, null, 2),
);

console.log(`\n✅ JSON generado: ${nombreArchivo}`);
