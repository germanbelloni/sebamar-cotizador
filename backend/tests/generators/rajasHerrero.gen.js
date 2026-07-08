// backend/tests/generators/rajasHerrero.generator.js

const fs = require("fs");
const path = require("path");

const { fromRoot } = require("../../utils/path");

const calcularRajaHerrero = require(
  fromRoot("wrappers/rajas/calcularRajaHerrero"),
);

const data = require(fromRoot("backend/data/productos/rajas_herrero.json"));

// =========================
// ⚙ CONFIG
// =========================

const CONFIG = {
  colores: ["blanco", "negro", "simil madera"],

  vidrios: ["3mm", "4mm", "5mm", "fantasia", "esmerilado", "3+3"],

  modelos: ["raja", "brazo", "volcable"],

  perfiles: ["amarilla"],

  bisagras: ["izquierda", "derecha"],
};

// =========================
// 📦 RESULTADOS
// =========================

const resultados = [];

// =========================
// 📁 OUTPUT
// =========================

const outputDir = fromRoot("backend/tests/generated/rajas");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, {
    recursive: true,
  });
}

// =========================
// 🚀 GENERADOR
// =========================

Object.keys(data.medidas).forEach((medida) => {
  const [ancho, alto] = medida.split("x").map(Number);

  CONFIG.colores.forEach((color) => {
    CONFIG.vidrios.forEach((tipoVidrio) => {
      CONFIG.modelos.forEach((modelo) => {
        CONFIG.perfiles.forEach((perfil) => {
          CONFIG.bisagras.forEach((bisagra) => {
            const input = {
              ancho,
              alto,
              color,
              tipoVidrio,
              modelo,
              perfil,
              bisagra,
            };

            try {
              const output = calcularRajaHerrero(input);

              resultados.push({
                ok: true,
                input,
                output,
              });

              console.log(`✔ ${medida} | ${modelo} | ${tipoVidrio} | ${color}`);
            } catch (error) {
              resultados.push({
                ok: false,
                input,
                error: error.message,
              });

              console.log(`❌ ${medida} | ${modelo}`);

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
    ancho: 999,
    alto: 999,
    color: "blanco",
    tipoVidrio: "4mm",
    modelo: "raja",
    perfil: "amarilla",
    bisagra: "izquierda",
  },

  {
    ancho: 40,
    alto: 40,
    color: "blanco",
    tipoVidrio: "vidrio_inexistente",
    modelo: "raja",
    perfil: "amarilla",
    bisagra: "izquierda",
  },

  {
    ancho: 40,
    alto: 40,
    color: "blanco",
    tipoVidrio: "4mm",
    modelo: "modelo_inexistente",
    perfil: "amarilla",
    bisagra: "izquierda",
  },
];

casosInvalidos.forEach((input) => {
  try {
    const output = calcularRajaHerrero(input);

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

const fileName = `rajas_herrero_${Date.now()}.json`;

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

console.log("✅ Generator Rajas Herrero OK");

console.log("================================");

console.log(`📁 Archivo: ${outputPath}`);

console.log(`📦 Casos generados: ${resultados.length}`);

console.log(`✅ OK: ${ok}`);

console.log(`❌ Errores: ${errores}`);

console.log("================================");
