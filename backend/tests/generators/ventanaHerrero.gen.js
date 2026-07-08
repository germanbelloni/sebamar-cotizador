// backend/tests/generators/ventanaHerrero.generator.js

const fs = require("fs");
const path = require("path");

// 🔧 PATH
const { fromRoot } = require("../../utils/path");

// 🧠 WRAPPER
const calcularVentanaHerrero = require(
  fromRoot("wrappers/ventanas/calcularVentanaHerrero"),
);

// 📦 DATA
const data = require(fromRoot("backend/data/productos/ventanas_herrero.json"));

// =========================
// ⚙ CONFIG
// =========================

const CONFIG = {
  colores: ["blanco", "negro", "bronce", "simil madera"],

  perfiles: ["amarilla"],

  guias: [true, false],

  mosquiteros: [true, false],

  cortinas: [null, "pvc", "aluminio"],

  cajonBlock: [true, false],
};

// =========================
// 📦 RESULTADOS
// =========================

const resultados = [];

// =========================
// 📁 OUTPUT
// =========================

const outputDir = fromRoot("backend/tests/generated/ventanas");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, {
    recursive: true,
  });
}

// =========================
// 🔍 HELPERS
// =========================

function getMedidas() {
  return Object.keys(data.medidas || {});
}

function parseMedida(medida) {
  const [anchoStr, altoStr] = medida.split("x");

  const ancho = Number(String(anchoStr).replace(",", "."));

  const alto = Number(String(altoStr).replace(",", "."));

  return {
    ancho,
    alto,
  };
}

// =========================
// 🚀 GENERADOR
// =========================

function generar() {
  const medidas = getMedidas();

  medidas.forEach((medida) => {
    const { ancho, alto } = parseMedida(medida);

    if (Number.isNaN(ancho) || Number.isNaN(alto)) {
      resultados.push({
        ok: false,
        input: {
          medida,
        },
        error: "Medida inválida en JSON",
      });

      console.log(`❌ medida inválida: ${medida}`);

      return;
    }

    CONFIG.colores.forEach((color) => {
      CONFIG.perfiles.forEach((perfil) => {
        CONFIG.guias.forEach((guia) => {
          CONFIG.mosquiteros.forEach((mosquitero) => {
            CONFIG.cortinas.forEach((cortina) => {
              CONFIG.cajonBlock.forEach((cajonBlock) => {
                const input = {
                  ancho,
                  alto,
                  color,
                  guia,
                  mosquitero,
                  cortina,
                  cajonBlock,
                  perfil,
                };
                if (cajonBlock && guia) return;
                if (!guia && cortina) return;
                try {
                  const output = calcularVentanaHerrero(input);

                  resultados.push({
                    ok: true,
                    input,
                    output,
                  });

                  console.log(`✔ herrero | ${medida} | ${color}`);
                } catch (error) {
                  resultados.push({
                    ok: false,
                    input,
                    error: error.message,
                  });

                  console.log(`❌ herrero | ${medida} | ${color}`);

                  console.log(`👉 ${error.message}`);
                }
              });
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

const fileName = `ventana_herrero_${Date.now()}.json`;

const outputPath = path.join(outputDir, fileName);

fs.writeFileSync(outputPath, JSON.stringify(resultados, null, 2));

// =========================
// 📊 STATS
// =========================

const ok = resultados.filter((r) => r.ok).length;

const errores = resultados.length - ok;

console.log("\n================================");
console.log("✅ Generator Ventana Herrero OK");
console.log("================================");
console.log(`📁 Archivo: ${outputPath}`);
console.log(`📦 Casos generados: ${resultados.length}`);
console.log(`✅ OK: ${ok}`);
console.log(`❌ Errores: ${errores}`);
console.log("================================");
