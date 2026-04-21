const fs = require("fs");
const path = require("path");

// 🔧 PATH HELPER
const { fromRoot } = require("../../../utils/path");

// 🧠 SERVICE
const calcularPatagonicaHerrero = require(
  fromRoot("services/patagonicas/calcularPatagonicaHerrero.js"),
);

// 📁 OUTPUT
const baseOutput = process.env.OUTPUT_DIR || "scripts/tests/outputs";
const outputDir = fromRoot(`${baseOutput}/patagonicas_herrero`);

// 🎯 CONFIG BASE
const CONFIG = {
  perfil: "amarilla",
  medidas: ["120x100", "150x100", "200x100"],
  tipos: ["1_raja", "2_rajas"],
  rajas: [
    { ancho: 40, tipoVidrio: "4mm" },
    { ancho: 50, tipoVidrio: "4mm" },
  ],
  colores: ["blanco", "negro"],
};

// 📦 RESULTADOS
let resultados = [];

// 📁 ASEGURAR OUTPUT DIR
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 🔍 VALIDADORES
function isValidMedida(medida) {
  return typeof medida === "string" && medida.includes("x");
}

function isValidRaja(raja) {
  return (
    raja &&
    typeof raja.ancho === "number" &&
    typeof raja.tipoVidrio === "string"
  );
}

// 🔁 GENERADOR
function generarEscenarios() {
  const { perfil, medidas, tipos, rajas, colores } = CONFIG;

  tipos.forEach((tipo) => {
    medidas.forEach((medidaTotal) => {
      if (!isValidMedida(medidaTotal)) return;

      colores.forEach((color) => {
        rajas.forEach((raja) => {
          if (!isValidRaja(raja)) return;

          const input = {
            medidaTotal,
            tipo,
            raja,
            color,
            perfil,
          };

          try {
            const result = calcularPatagonicaHerrero(input);

            resultados.push({
              input,
              output: result,
            });

            console.log(
              `✔ ${medidaTotal} ${tipo} raja:${raja.ancho} vidrio:${raja.tipoVidrio} ${color} → ${result?.total ?? "sin_total"}`,
            );
          } catch (error) {
            resultados.push({
              input,
              error: error.message,
            });

            console.log(
              `❌ ERROR → ${medidaTotal} ${tipo} raja:${raja.ancho} ${color}`,
            );
            console.log("   👉", error.message);
          }
        });
      });
    });
  });
}

// 🚀 RUN
generarEscenarios();

// 💾 SAVE
const nombreArchivo = `output_patagonica_herrero_${Date.now()}.json`;

fs.writeFileSync(
  path.join(outputDir, nombreArchivo),
  JSON.stringify(resultados, null, 2),
);

console.log(`\n✅ JSON generado: ${nombreArchivo}`);
