const fs = require("fs");
const path = require("path");

// 🔧 PATH HELPER
const fromRoot = (...paths) => path.join(process.cwd(), ...paths);

// 📦 DATA
const data = require(
  fromRoot("frontend", "data", "productos", "postigones.json"),
);

// 🧠 SERVICE
const calcularPostigon = require(
  fromRoot("services", "postigones", "calcularPostigon.js"),
);

// 🎯 CONFIG
const CONFIG = {
  colores: ["blanco", "negro", "bronce", "simil madera"],
  tipos: ["corredizo", "abrir"],
};

// 📦 RESULTADOS
let resultados = [];

// 📁 OUTPUT
const baseOutput =
  process.env.OUTPUT_DIR || path.join(process.cwd(), "tests", "output");

const folderName = path.basename(__filename).replace(".gen.js", "");
const outputDir = path.join(baseOutput, folderName);

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 🔍 VALIDADORES
function getMedidas() {
  if (!data?.medidas || typeof data.medidas !== "object") {
    throw new Error("JSON inválido: no existe 'medidas'");
  }

  return Object.keys(data.medidas);
}

function isValidMedida(medida) {
  return typeof medida === "string" && medida.includes("x");
}

// 🔁 GENERADOR
function generar() {
  const { colores, tipos } = CONFIG;

  let medidas;

  try {
    medidas = getMedidas();
  } catch (err) {
    console.log(`❌ ${err.message}`);
    return;
  }

  medidas.forEach((medida) => {
    if (!isValidMedida(medida)) return;

    colores.forEach((color) => {
      tipos.forEach((tipo) => {
        // 🔹 CORREDIZO
        if (tipo === "corredizo") {
          const input = {
            medida,
            tipo: "corredizo",
            color,
          };

          try {
            const result = calcularPostigon(input);

            resultados.push({ input, output: result });

            console.log(
              `✔ ${medida} (${color}) tipo:corredizo → ${
                result?.total ?? "sin_total"
              }`,
            );
          } catch (error) {
            resultados.push({ input, error: error.message });

            console.log(`❌ ERROR → ${medida} (${color}) corredizo`);
            console.log("   👉", error.message);
          }
        }

        // 🔹 ABRIR (normal + ancho)
        if (tipo === "abrir") {
          ["normal", "ancho"].forEach((marcoTipo) => {
            const marco = marcoTipo === "ancho" ? "ancho" : undefined;

            const input = {
              medida,
              tipo: "abrir",
              color,
              marco,
            };

            try {
              const result = calcularPostigon(input);

              resultados.push({
                input: {
                  ...input,
                  marco: marco || "normal",
                },
                output: result,
              });

              console.log(
                `✔ ${medida} (${color}) tipo:abrir marco:${marcoTipo} → ${
                  result?.total ?? "sin_total"
                }`,
              );
            } catch (error) {
              resultados.push({
                input: {
                  ...input,
                  marco: marco || "normal",
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
}

// 🚀 RUN
generar();

// 💾 SAVE
const nombreArchivo = `postigon_${Date.now()}.json`;

fs.writeFileSync(
  path.join(outputDir, nombreArchivo),
  JSON.stringify(resultados, null, 2),
);

console.log(`\n✅ JSON generado: ${nombreArchivo}`);
