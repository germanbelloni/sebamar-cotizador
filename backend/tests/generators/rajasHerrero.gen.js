const fs = require("fs");
const path = require("path");

// 🔧 PATH HELPER
const { fromRoot } = require("../../utils/path");

// 📦 DATA
const data = require(
  fromRoot("frontend", "data", "productos", "rajas_herrero.json"),
);

// 🧠 SERVICE
const calcularRaja = require(fromRoot("services", "rajas", "calcularRaja.js"));

// 🎯 CONFIG
const CONFIG = {
  colores: ["blanco", "negro", "bronce", "simil madera"],
  vidrios: ["3mm", "4mm", "5mm", "esmerilado", "fantasia", "3+3"],
  perfil: "amarilla",
  linea: "herrero",
};

// 📦 RESULTADOS
let resultados = [];

// 📁 OUTPUT
const baseOutput =
  process.env.OUTPUT_DIR || path.join(process.cwd(), "tests", "output");

// 📁 nombre de carpeta = nombre del archivo sin .gen.js
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
  const { colores, vidrios, perfil, linea } = CONFIG;

  let medidas;

  try {
    medidas = getMedidas();
  } catch (err) {
    console.log(`❌ ${err.message}`);
    return;
  }

  colores.forEach((color) => {
    medidas.forEach((medida) => {
      if (!isValidMedida(medida)) return;

      let resultadoVidrios = {};

      vidrios.forEach((vidrio) => {
        const input = {
          medida,
          tipoVidrio: vidrio,
          color,
          perfil,
        };

        try {
          const r = calcularRaja(input);
          resultadoVidrios[vidrio] = r?.total ?? null;
        } catch (error) {
          resultadoVidrios[vidrio] = {
            error: error.message,
          };

          console.log(`❌ ERROR vidrio → ${medida} ${color} ${vidrio}`);
        }
      });

      resultados.push({
        input: {
          medida,
          color,
          perfil,
          linea,
        },
        output: {
          vidrios: resultadoVidrios,
        },
      });

      console.log(`✔ ${medida} (${color}) procesado`);
    });
  });
}

// 🚀 RUN
generar();

// 💾 SAVE
const nombreArchivo = `rajas_herrero_${Date.now()}.json`;

fs.writeFileSync(
  path.join(outputDir, nombreArchivo),
  JSON.stringify(resultados, null, 2),
);

console.log(`\n✅ JSON generado: ${nombreArchivo}`);



