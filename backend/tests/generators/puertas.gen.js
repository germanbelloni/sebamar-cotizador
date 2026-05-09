// backend/tests/generators/puertas.generator.js

const fs = require("fs");

const path = require("path");

// 🔧 PATH
const { fromRoot } = require("../../utils/path");

// 🧠 WRAPPER
const calcularPuerta = require(fromRoot("wrappers/puertas/calcularPuerta.js"));

// =========================
// 📦 DATA
// =========================

const dataMap = {
  herrero: require(fromRoot("backend/data/productos/puertas_herrero.json")),

  modena: require(fromRoot("backend/data/productos/puertas_modena.json")),

  eco: require(fromRoot("backend/data/productos/puertas_eco.json")),
};

// =========================
// ⚙ CONFIG
// =========================

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

// =========================
// 📦 RESULTADOS
// =========================

const resultados = [];

// =========================
// 📁 OUTPUT
// =========================

const outputDir = fromRoot("backend/tests/generated/puertas");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, {
    recursive: true,
  });
}

// =========================
// 🔍 HELPERS
// =========================

function getModelos(data) {
  return Object.keys(data.modelos || {}).filter(
    (modelo) =>
      !modelo.toLowerCase().includes("barral") &&
      !modelo.toLowerCase().includes("adicional"),
  );
}

// =========================
// 🚀 GENERADOR
// =========================

function generar() {
  const { colores, perfil, medidas, vidriosPorLinea } = CONFIG;

  Object.keys(dataMap).forEach((linea) => {
    const data = dataMap[linea];

    const modelos = getModelos(data);

    const vidrios = vidriosPorLinea[linea] || [];

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
                const output = calcularPuerta(input);

                resultados.push({
                  ok: true,

                  input,

                  output,
                });

                console.log(
                  `✔ ${linea} | ${tipo} | ${modelo} → $${output?.precioVenta}`,
                );
              } catch (error) {
                resultados.push({
                  ok: false,

                  input,

                  error: error.message,
                });

                console.log(`❌ ${linea} | ${modelo}`);

                console.log(`👉 ${error.message}`);
              }
            });
          });
        });
      });
    });
  });
}

// =========================
// 🚀 RUN
// =========================

generar();

// =========================
// 💾 SAVE
// =========================

const fileName = `puertas_${Date.now()}.json`;

const outputPath = path.join(outputDir, fileName);

fs.writeFileSync(
  outputPath,

  JSON.stringify(resultados, null, 2),
);

// =========================
// ✅ LOG
// =========================

console.log(`\n✅ Generator Puertas OK`);

console.log(`📁 Archivo: ${outputPath}`);

console.log(`📦 Casos generados: ${resultados.length}`);
