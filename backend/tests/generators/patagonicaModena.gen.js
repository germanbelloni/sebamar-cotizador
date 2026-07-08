// backend/tests/generators/patagonicaModena.generator.js

const fs = require("fs");
const path = require("path");

const { fromRoot } = require("../../utils/path");

const calcularPatagonicaModena = require(
  fromRoot("wrappers/patagonicas/calcularPatagonicaModena"),
);

const data = require(
  fromRoot("backend/data/productos/patagonicas_modena.json"),
);

// =========================
// ⚙ CONFIG
// =========================

const CONFIG = {
  colores: ["blanco", "negro", "simil madera"],

  cantidadesRajas: [1, 2],

  vidrios: ["4mm", "3+3", "dvh"],

  aperturas: ["abrir", "oscilobatiente"],

  lados: ["derecha", "izquierda"],

  perfiles: ["amarilla"],
};

// =========================
// 📦 RESULTADOS
// =========================

const resultados = [];

// =========================
// 📁 OUTPUT
// =========================

const outputDir = fromRoot("backend/tests/generated/patagonicas");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, {
    recursive: true,
  });
}

// =========================
// 🔍 HELPERS
// =========================

function getMedidas() {
  const medidas = [];

  Object.entries(data.tipos || {}).forEach(([tipo, config]) => {
    Object.keys(config.medidas || {}).forEach((medida) => {
      medidas.push({
        tipo,
        medida,
      });
    });
  });

  return medidas;
}

// =========================
// 🚀 GENERADOR
// =========================

getMedidas().forEach(({ tipo, medida }) => {
  const cantidadRajas = tipo === "1_raja" ? 1 : 2;

  CONFIG.colores.forEach((color) => {
    CONFIG.vidrios.forEach((tipoVidrio) => {
      CONFIG.aperturas.forEach((tipoApertura) => {
        CONFIG.lados.forEach((ladoApertura) => {
          CONFIG.perfiles.forEach((perfil) => {
            const input = {
              medida,

              cantidadRajas,

              tipoVidrio,

              color,

              perfil,

              tipoApertura,

              ladoApertura,
            };

            try {
              const output = calcularPatagonicaModena(input);

              resultados.push({
                ok: true,
                input,
                output,
              });

              console.log(
                `✔ ${medida} | ${cantidadRajas} rajas | ${color} | ${tipoVidrio}`,
              );
            } catch (error) {
              resultados.push({
                ok: false,
                input,
                error: error.message,
              });

              console.log(
                `❌ ${medida} | ${cantidadRajas} rajas | ${tipoVidrio}`,
              );

              console.log(`👉 ${error.message}`);
            }
          });
        });
      });
    });
  });
});

// =========================
// 🧪 CASOS INVÁLIDOS
// =========================

const casosInvalidos = [
  {
    medida: "100x60",
    cantidadRajas: 2,
    tipoVidrio: "dvh",
    color: "blanco",
    perfil: "amarilla",
    tipoApertura: "abrir",
    ladoApertura: "derecha",
  },

  {
    medida: "999x999",
    cantidadRajas: 1,
    tipoVidrio: "4mm",
    color: "blanco",
    perfil: "amarilla",
    tipoApertura: "abrir",
    ladoApertura: "derecha",
  },
];

casosInvalidos.forEach((input) => {
  try {
    const output = calcularPatagonicaModena(input);

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
// 💾 SAVE
// =========================

const fileName = `patagonica_modena_${Date.now()}`;

const outputPath = path.join(outputDir, `${fileName}.json`);

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

console.log("✅ Generator Patagónica Modena OK");

console.log("================================");

console.log(`📁 Archivo: ${outputPath}`);

console.log(`📦 Casos generados: ${resultados.length}`);

console.log(`✅ OK: ${ok}`);

console.log(`❌ Errores: ${errores}`);

console.log("================================");
