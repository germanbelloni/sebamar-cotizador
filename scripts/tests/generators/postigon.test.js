const fs = require("fs");

// 🔧 PATH HELPER
const { fromRoot } = require("../../../utils/path");

// 📦 DATA
const data = require(fromRoot("frontend/data/productos/postigones.json"));

// 🧠 SERVICE
const calcularPostigon = require(
  fromRoot("services/postigones/calcularPostigon.js"),
);

// 🎯 VARIABLES
const colores = ["blanco", "negro", "bronce", "simil madera"];
const tipos = ["corredizo", "abrir"];

// 📦 RESULTADO FINAL
let resultados = [];

Object.keys(data.medidas).forEach((medida) => {
  const info = data.medidas[medida];

  colores.forEach((color) => {
    tipos.forEach((tipo) => {
      // 🔹 CASO CORREDIZO (sin marco)
      if (tipo === "corredizo") {
        try {
          const result = calcularPostigon({
            medida,
            tipo: "corredizo",
            color,
          });

          resultados.push({
            input: {
              medida,
              tipo: "corredizo",
              color,
            },
            output: result,
          });

          console.log(
            `✔ ${medida} (${color}) tipo:corredizo → ${result.total}`,
          );
        } catch (error) {
          resultados.push({
            input: {
              medida,
              tipo: "corredizo",
              color,
            },
            error: error.message,
          });

          console.log(`❌ ERROR → ${medida} (${color}) corredizo`);
          console.log("   👉", error.message);
        }
      }

      // 🔹 CASO ABRIR (2 variantes: sin marco y marco ancho)
      if (tipo === "abrir") {
        ["normal", "ancho"].forEach((marcoTipo) => {
          try {
            const marco = marcoTipo === "ancho" ? "ancho" : undefined;

            const result = calcularPostigon({
              medida,
              tipo: "abrir",
              color,
              marco,
            });

            resultados.push({
              input: {
                medida,
                tipo: "abrir",
                color,
                marco: marco || "normal",
              },
              output: result,
            });

            console.log(
              `✔ ${medida} (${color}) tipo:abrir marco:${marcoTipo} → ${result.total}`,
            );
          } catch (error) {
            resultados.push({
              input: {
                medida,
                tipo: "abrir",
                color,
                marco: marcoTipo,
              },
              error: error.message,
            });

            console.log(
              `❌ ERROR → ${medida} (${color}) abrir marco:${marcoTipo}`,
            );
            console.log("   👉", error.message);
          }
        });
      }
    });
  });
});

// 💾 GUARDAR JSON
const nombreArchivo = `output_postigon_${Date.now()}.json`;

fs.writeFileSync(
  fromRoot("scripts/tests/outputs/postigones", nombreArchivo),
  JSON.stringify(resultados, null, 2),
);

console.log(`\n✅ JSON generado: ${nombreArchivo}`);
