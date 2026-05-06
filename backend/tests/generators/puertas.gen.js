const fs = require("fs");
const path = require("path");

// 🔧 PATH HELPER
const { fromRoot } = require("../../utils/path");

// 🧠 WRAPPER (NO SERVICE)
const calcularPuerta = require(
  fromRoot("wrappers", "puertas", "calcularPuerta.js"),
);

// 📦 DATA
const dataMap = {
  herrero: require(
    fromRoot("frontend", "data", "productos", "puertas_herrero.json"),
  ),
  modena: require(
    fromRoot("frontend", "data", "productos", "puertas_modena.json"),
  ),
  eco: require(fromRoot("frontend", "data", "productos", "puertas_eco.json")),
};

// 🎯 CONFIG
const CONFIG = {
  colores: ["blanco", "negro", "bronce", "simil madera"],
  perfil: "amarilla",
  medidas: {
    simple: ["70x200", "80x200", "90x200"],
    doble: ["140x200", "160x200", "180x200"],
  },
  vidriosPorLinea: {
    herrero: ["3mm", "4mm", "5mm", "fantasia", "esmerilado", "3+3"],
    modena: ["4mm", "3+3", "dvh"],
    eco: ["3mm", "4mm", "fantasia"],
  },
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
function getModelos(data) {
  return Object.keys(data.modelos || {}).filter(
    (m) =>
      !m.toLowerCase().includes("barral") &&
      !m.toLowerCase().includes("adicional"),
  );
}

// 🔁 GENERADOR
function generar() {
  const { colores, perfil, medidas, vidriosPorLinea } = CONFIG;

  Object.keys(dataMap).forEach((linea) => {
    const data = dataMap[linea];
    const modelos = getModelos(data);
    const vidrios = vidriosPorLinea[linea];

    modelos.forEach((modelo) => {
      Object.keys(medidas).forEach((tipo) => {
        medidas[tipo].forEach((medida) => {
          colores.forEach((color) => {
            vidrios.forEach((tipoVidrio) => {
              const input = {
                tipo,
                linea,
                modelo,
                medida,
                color,
                tipoVidrio,
                perfil,
              };

              try {
                const result = calcularPuerta(input);

                resultados.push({ input, output: result });

                console.log(
                  `✔ ${linea} | ${tipo} | ${modelo} → $${result?.precioVenta} (costo: ${result?.costo})`,
                );
              } catch (error) {
                resultados.push({ input, error: error.message });

                console.log(`❌ ${linea} ${modelo}`);
                console.log("   👉", error.message);
              }
            });
          });
        });
      });
    });
  });
}

// 🚀 RUN
generar();

// 💾 SAVE
const nombreArchivo = `puertas_${Date.now()}.json`;

fs.writeFileSync(
  path.join(outputDir, nombreArchivo),
  JSON.stringify(resultados, null, 2),
);

console.log(`\n✅ JSON generado: ${nombreArchivo}`);
