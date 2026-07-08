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

function modeloSinVidrio(data, modelo) {
  const item = data.modelos?.[modelo];

  return item?.sinVidrio === true;
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
            const listaVidrios = modeloSinVidrio(data, modelo)
              ? [null]
              : vidrios;

            listaVidrios.forEach((tipoVidrio) => {
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

                console.log(`✔ ${linea} | ${tipo} | ${modelo} | ${medida}`);
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
// 🧪 CASOS INVÁLIDOS
// =========================

const casosInvalidos = [
  {
    tipo: "simple",
    linea: "herrero",
    modelo: "modelo_inexistente",
    medida: "80x200",
    color: "blanco",
    tipoVidrio: "4mm",
    perfil: "amarilla",
  },

  {
    tipo: "simple",
    linea: "herrero",
    modelo: "modelo 1",
    medida: "999x999",
    color: "blanco",
    tipoVidrio: "4mm",
    perfil: "amarilla",
  },

  {
    tipo: "simple",
    linea: "modena",
    modelo: "modelo 1",
    medida: "80x200",
    color: "blanco",
    tipoVidrio: "vidrio_inexistente",
    perfil: "amarilla",
  },

  {
    tipo: "doble",
    linea: "eco",
    modelo: "modelo 1",
    medida: "180x200",
    color: "blanco",
    tipoVidrio: "3+3",
    perfil: "amarilla",
  },
];

casosInvalidos.forEach((input) => {
  try {
    const output = calcularPuerta(input);

    resultados.push({
      ok: true,
      input,
      output,
    });
  } catch (error) {
    resultados.push({
      ok: false,
      input,
      error: error.message,
    });
  }
});

// =========================
// 🚀 RUN
// =========================

generar();

// =========================
// 💾 SAVE
// =========================

const fileName = `puertas_${Date.now()}.json`;

const outputPath = path.join(outputDir, fileName);

fs.writeFileSync(outputPath, JSON.stringify(resultados, null, 2));

// =========================
// 📊 STATS
// =========================

const ok = resultados.filter((r) => r.ok).length;

const errores = resultados.length - ok;

// =========================
// ✅ LOG
// =========================

console.log("\n================================");

console.log("✅ Generator Puertas OK");

console.log("================================");

console.log(`📁 Archivo: ${outputPath}`);

console.log(`📦 Casos generados: ${resultados.length}`);

console.log(`✅ OK: ${ok}`);

console.log(`❌ Errores: ${errores}`);

console.log("================================");
