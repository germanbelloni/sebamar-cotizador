// generators/mosquiteros.js

const fs = require("fs");

const { fromRoot } = require("../../utils/path");

const calcularMosquiteroVentana = require(
  fromRoot("wrappers/mosquiteros/calcularMosquiteroVentana"),
);

// =========================
// 🧪 CASOS
// =========================

const casos = [
  {
    ancho: 100,
    alto: 100,
  },

  {
    ancho: 120,
    alto: 120,
    color: "negro",
  },

  {
    ancho: 150,
    alto: 120,
    color: "blanco",
  },
];

// =========================
// 🚀 GENERAR
// =========================

const resultados = casos.map((input) => {
  try {
    const output = calcularMosquiteroVentana(input);

    return {
      ok: true,

      input,

      output,
    };
  } catch (error) {
    return {
      ok: false,

      input,

      error: error.message,
    };
  }
});

// =========================
// 💾 SAVE
// =========================

const outputPath = fromRoot("backend/tests/generated/mosquiteros.json");

fs.writeFileSync(outputPath, JSON.stringify(resultados, null, 2));

// =========================
// ✅ LOG
// =========================

console.log(`✅ Mosquiteros generados: ${resultados.length}`);

console.log(`📁 Archivo: ${outputPath}`);
