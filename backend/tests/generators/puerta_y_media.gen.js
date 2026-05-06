const fs = require("fs");
const path = require("path");

// 🔧 PATH HELPER
const { fromRoot } = require("../../utils/path");

// 🧠 WRAPPER (IMPORTANTE: NO SERVICE)
const calcularPuerta = require(
  fromRoot("wrappers", "puertas", "calcularPuerta.js"),
);

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
const baseOutput =
  process.env.OUTPUT_DIR || path.join(process.cwd(), "tests", "output");

const folderName = path.basename(__filename).replace(".gen.js", "");
const outputDir = path.join(baseOutput, folderName);

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// 🔍 HELPERS
function loadData(linea) {
  return require(
    fromRoot("frontend", "data", "productos", `puertas_${linea}.json`),
  );
}

function getModelosPuerta(data) {
  if (!data?.modelos) throw new Error("modelos no existe");
  return Object.keys(data.modelos);
}

function getModelosMedia(data, linea) {
  if (linea === "herrero") {
    const dataMedias = require(
      fromRoot("frontend", "data", "productos", "puertas_media_herrero.json"),
    );
    return Object.keys(dataMedias.medias || {});
  }
  return Object.keys(data.modelos || {});
}

// 🔁 GENERADOR
function generar() {
  const { colores, vidrios, lineas, medida, perfil } = CONFIG;

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
                `✔ ${linea} → ${modeloPuerta} + ${modeloMedia} → $${result?.precioVenta}`,
              );
            } catch (error) {
              resultados.push({ input, error: error.message });

              console.log(`❌ ${linea} ${modeloPuerta} + ${modeloMedia}`);
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
