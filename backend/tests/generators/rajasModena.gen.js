const fs = require("fs");
const path = require("path");

// 🔧 PATH HELPER
const { fromRoot } = require("../../utils/path");

// 📦 DATA
const data = require(
  fromRoot("frontend", "data", "productos", "rajas_modena.json"),
);

// 🧠 SERVICE
const calcularRaja = require(fromRoot("services", "rajas", "calcularRaja.js"));

// 🎯 CONFIG
const CONFIG = {
  colores: ["blanco", "negro", "bronce", "simil madera"],
  linea: "modena",
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
function isObject(val) {
  return val && typeof val === "object" && !Array.isArray(val);
}

function isValidMedida(medida) {
  return typeof medida === "string" && medida.includes("x");
}

function getMedidas() {
  if (!isObject(data?.medidas)) {
    throw new Error("JSON inválido: 'medidas' no existe");
  }

  return Object.keys(data.medidas);
}

// 🔁 GENERADOR
function generar() {
  const { colores, linea } = CONFIG;

  let medidas;

  try {
    medidas = getMedidas();
  } catch (err) {
    console.log(`❌ ${err.message}`);
    return;
  }

  medidas.forEach((medida) => {
    if (!isValidMedida(medida)) return;

    const info = data.medidas[medida];
    if (!isObject(info)) return;

    const vidrios = Object.keys(info.vidrios || {});
    if (!vidrios.length) return;

    colores.forEach((color) => {
      vidrios.forEach((tipoVidrio) => {
        [false, true].forEach((conCamara) => {
          const extraVidrio = conCamara ? info.camara || 0 : 0;

          const input = {
            medida,
            tipoVidrio,
            color,
            linea,
            extraVidrio,
          };

          try {
            const result = calcularRaja(input);

            resultados.push({
              input: {
                ...input,
                conCamara,
              },
              output: result,
            });

            console.log(
              `✔ ${medida} (${color}) vidrio:${tipoVidrio} camara:${conCamara} → ${
                result?.total ?? "sin_total"
              }`,
            );
          } catch (error) {
            resultados.push({
              input: {
                ...input,
                conCamara,
              },
              error: error.message,
            });

            console.log(
              `❌ ERROR → ${medida} (${color}) vidrio:${tipoVidrio} camara:${conCamara}`,
            );
            console.log("   👉", error.message);
          }
        });
      });
    });
  });
}

// 🚀 RUN
generar();

// 💾 SAVE
const nombreArchivo = `rajas_modena_${Date.now()}.json`;

fs.writeFileSync(
  path.join(outputDir, nombreArchivo),
  JSON.stringify(resultados, null, 2),
);

console.log(`\n✅ JSON generado: ${nombreArchivo}`);



