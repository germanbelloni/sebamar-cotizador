const fs = require("fs");
const path = require("path");

// 🔧 PATH HELPER
const { fromRoot } = require("../../utils/path");

// 📦 DATA
const data = require(
  fromRoot("frontend", "data", "productos", "ventanas_herrero.json"),
);

// 🧠 SERVICE
const calcularVentana = require(
  fromRoot("services", "ventanas", "calcularVentana.js"),
);

// 🎯 CONFIG
const CONFIG = {
  colores: ["blanco", "negro", "bronce", "simil madera"],
  linea: "herrero",
};

// 📦 RESULTADOS
let resultados = [];

// 📁 OUTPUT
const baseOutput = path.join(__dirname, "..", "output");

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

  colores.forEach((color) => {
    medidas.forEach((medida) => {
      if (!isValidMedida(medida)) return;

      const input = {
        medida,
        color,
        linea,
        incluirGuia: true,
        incluirMosquitero: true,
      };

      try {
        const r = calcularVentana(input);

        resultados.push({
          input,
          output: {
            costoBase: Math.round(r.costoBase),
            costoGuia: Math.round(r.costoGuia),
            costoMosquitero: Math.round(r.costoMosquitero),
          },
        });

        console.log(
          `✔ ${medida} (${color}) → base:${Math.round(r.costoBase)} guia:${Math.round(r.costoGuia)} mosq:${Math.round(r.costoMosquitero)}`,
        );
      } catch (err) {
        console.log(`❌ error → ${medida} ${color}`);
      }
    });
  });
}

// 🚀 RUN
generar();

// 💾 SAVE
const nombreArchivo = `ventana_herrero_${Date.now()}.json`;

fs.writeFileSync(
  path.join(outputDir, nombreArchivo),
  JSON.stringify(resultados, null, 2),
);

console.log(`\n✅ JSON generado: ${nombreArchivo}`);
