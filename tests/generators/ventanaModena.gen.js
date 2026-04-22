const fs = require("fs");
const path = require("path");

// 🔧 PATH HELPER
const fromRoot = (...paths) => path.join(process.cwd(), ...paths);

// 📦 DATA
const data = require(
  fromRoot("frontend", "data", "productos", "ventanas_modena.json"),
);

// 🧠 SERVICE
const calcularVentana = require(
  fromRoot("services", "ventanas", "calcularVentana.js"),
);

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

    colores.forEach((color) => {
      const input = {
        medida,
        color,
        linea,
      };

      try {
        const result = calcularVentana(input);

        resultados.push({
          input,
          output: result,
        });

        console.log(`✔ ${medida} (${color}) → ${result?.total ?? "sin_total"}`);
      } catch (error) {
        resultados.push({
          input,
          error: error.message,
        });

        console.log(`❌ ERROR → ${medida} (${color})`);
        console.log("   👉", error.message);
      }
    });
  });
}

// 🚀 RUN
generar();

// 💾 SAVE
const nombreArchivo = `ventana_modena_${Date.now()}.json`;

fs.writeFileSync(
  path.join(outputDir, nombreArchivo),
  JSON.stringify(resultados, null, 2),
);

console.log(`\n✅ JSON generado: ${nombreArchivo}`);
