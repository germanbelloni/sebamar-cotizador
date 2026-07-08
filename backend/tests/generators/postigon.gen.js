// backend/tests/generators/postigones.generator.js

const fs = require("fs");
const path = require("path");

const { fromRoot } = require("../../utils/path");

const calcularPostigones = require(
  fromRoot("wrappers/postigones/calcularPostigones"),
);

const data = require(fromRoot("backend/data/productos/postigones.json"));

// =========================
// ⚙ CONFIG
// =========================

const CONFIG = {
  colores: ["blanco", "negro", "bronce", "simil madera"],

  tipos: ["corredizo", "abrir"],

  perfiles: ["amarilla"],
};

// =========================
// 📦 RESULTADOS
// =========================

const resultados = [];

// =========================
// 📁 OUTPUT
// =========================

const outputDir = fromRoot("backend/tests/generated/postigones");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, {
    recursive: true,
  });
}

// =========================
// 🚀 GENERAR
// =========================

Object.keys(data.medidas || {}).forEach((medida) => {
  const [anchoStr, altoStr] = medida.split("x");

  const ancho = Number(String(anchoStr).replace(",", "."));

  const alto = Number(String(altoStr).replace(",", "."));

  if (Number.isNaN(ancho) || Number.isNaN(alto)) {
    resultados.push({
      ok: false,
      input: { medida },
      error: "Medida inválida",
    });

    return;
  }

  CONFIG.colores.forEach((color) => {
    CONFIG.tipos.forEach((tipo) => {
      CONFIG.perfiles.forEach((perfil) => {
        const input = {
          ancho,
          alto,
          tipo,
          color,
          perfil,
        };

        try {
          const output = calcularPostigones(input);

          resultados.push({
            ok: true,

            input: {
              medida,
              tipo,
              color,
              perfil,
            },

            output,
          });

          console.log(`✔ ${medida} | ${tipo} | ${color}`);
        } catch (error) {
          resultados.push({
            ok: false,

            input: {
              medida,
              tipo,
              color,
              perfil,
            },

            error: error.message,
          });

          console.log(`❌ ${medida} | ${tipo} | ${color}`);

          console.log(`👉 ${error.message}`);
        }
      });
    });
  });
});

// =========================
// 🧪 CASOS INVÁLIDOS
// =========================

const casosInvalidos = [
  {
    ancho: 50,
    alto: 100,
    tipo: "abrir",
    color: "blanco",
    perfil: "amarilla",
  },

  {
    ancho: 300,
    alto: 100,
    tipo: "abrir",
    color: "blanco",
    perfil: "amarilla",
  },

  {
    ancho: 100,
    alto: 250,
    tipo: "corredizo",
    color: "blanco",
    perfil: "amarilla",
  },
];

casosInvalidos.forEach((input) => {
  try {
    const output = calcularPostigones(input);

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

const fileName = `postigones_${Date.now()}.json`;

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

console.log("✅ Generator Postigones OK");

console.log("================================");

console.log(`📁 Archivo: ${outputPath}`);

console.log(`📦 Casos generados: ${resultados.length}`);

console.log(`✅ OK: ${ok}`);

console.log(`❌ Errores: ${errores}`);

console.log("================================");
