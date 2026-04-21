const fs = require("fs");
const path = require("path");

// 🔧 PATH HELPER
const { fromRoot } = require("../../../utils/path");

// 🧠 SERVICE
const calcularPuerta = require(fromRoot("services/puertas/calcularPuerta.js"));

// 🎯 CONFIG
const CONFIG = {
  colores: ["blanco", "negro", "bronce", "simil madera"],
  vidrios: ["4mm", "3+3", "fantasia", "esmerilado"],
  lineas: ["herrero", "modena"],
  medida: "120x200",
  perfil: "amarilla",
};

// 📦 RESULTADOS
let resultados = [];

// 📁 OUTPUT
const baseOutput = process.env.OUTPUT_DIR || "scripts/tests/outputs";
const outputDir = fromRoot(`${baseOutput}/puertas_y_media`);

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 🔍 VALIDADORES
function loadData(linea) {
  try {
    return require(fromRoot(`frontend/data/productos/puertas_${linea}.json`));
  } catch (err) {
    throw new Error(`No se pudo cargar JSON de linea: ${linea}`);
  }
}

function getModelosPuerta(data) {
  if (!data?.modelos || typeof data.modelos !== "object") {
    throw new Error("JSON inválido: 'modelos' no existe");
  }
  return Object.keys(data.modelos);
}

function getModelosMedia(data, linea) {
  if (linea === "herrero") {
    if (!data?.medias || typeof data.medias !== "object") {
      throw new Error("JSON inválido: 'medias' no existe en herrero");
    }
    return Object.keys(data.medias);
  }

  // modena
  return Object.keys(data.modelos || {});
}

function isValidMedida(medida) {
  return typeof medida === "string" && medida.includes("x");
}

// 🔁 GENERADOR
function generar() {
  const { colores, vidrios, lineas, medida, perfil } = CONFIG;

  if (!isValidMedida(medida)) {
    console.log("❌ Medida inválida");
    return;
  }

  lineas.forEach((linea) => {
    let data, modelosPuerta, modelosMedia;

    try {
      data = loadData(linea);
      modelosPuerta = getModelosPuerta(data);
      modelosMedia = getModelosMedia(data, linea);
    } catch (err) {
      console.log(`❌ ${err.message}`);
      return;
    }

    console.log(`\n🔧 LINEA: ${linea}`);
    console.log("modelosPuerta:", modelosPuerta.length);
    console.log("modelosMedia:", modelosMedia.length);

    colores.forEach((color) => {
      modelosPuerta.forEach((modeloPuerta) => {
        modelosMedia.forEach((modeloMedia) => {
          vidrios.forEach((tipoVidrio) => {
            const input = {
              tipo: "puerta_y_media",
              linea,
              modeloPuerta,
              modeloMedia,
              medida,
              color,
              tipoVidrio,
              perfil,
            };

            try {
              const result = calcularPuerta(input);

              resultados.push({ input, output: result });

              console.log(
                `✔ ${linea} → ${modeloPuerta} + ${modeloMedia} (${color}) → ${result?.total ?? "sin_total"}`,
              );
            } catch (error) {
              resultados.push({ input, error: error.message });

              console.log(
                `❌ ERROR → ${linea} ${modeloPuerta} + ${modeloMedia}`,
              );
              console.log("   👉", error.message);
            }
          });
        });
      });
    });
  });
}

// 🚀 RUN
generar();

// 💾 SAVE
const nombreArchivo = `puerta_y_media_${Date.now()}.json`;

fs.writeFileSync(
  path.join(outputDir, nombreArchivo),
  JSON.stringify(resultados, null, 2),
);

console.log(`\n✅ JSON generado: ${nombreArchivo}`);
