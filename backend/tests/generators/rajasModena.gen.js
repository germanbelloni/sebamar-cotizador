// backend/tests/generators/rajasModena.generator.js

const fs = require("fs");
const path = require("path");

const { fromRoot } = require("../../utils/path");

const calcularRajaModena = require(
  fromRoot("wrappers/rajas/calcularRajaModena"),
);

const data = require(fromRoot("backend/data/productos/rajas_modena.json"));

// =========================
// ⚙ CONFIG
// =========================

const CONFIG = {
  colores: ["blanco", "negro", "simil madera"],

  vidrios: ["4mm", "3+3", "dvh", "dvh_5_9_5"],

  modelos: ["raja", "oscilobatiente"],

  perfiles: ["amarilla"],

  bisagras: ["izquierda", "derecha"],

  mosquitero: [true, false],

  premarco: [true, false],

  contramarco: [true, false],
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
            CONFIG.mosquitero.forEach((mosquitero) => {
              CONFIG.premarco.forEach((premarco) => {
                CONFIG.contramarco.forEach((contramarco) => {
                  const input = {
                    ancho,
                    alto,
                    color,
                    tipoVidrio,
                    modelo,
                    perfil,
                    bisagra,
                    mosquitero,
                    premarco,
                    contramarco,
                  };

                  try {
                    const output = calcularRajaModena(input);

                    resultados.push({
                      ok: true,
                      input,
                      output,
                    });

                    console.log(
                      `✔ ${medida} | ${modelo} | ${tipoVidrio} | ${color}`,
                    );
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
    mosquitero: false,
    premarco: false,
    contramarco: false,
  },

  {
    ancho: 40,
    alto: 40,
    color: "blanco",
    tipoVidrio: "vidrio_inexistente",
    modelo: "raja",
    perfil: "amarilla",
    bisagra: "izquierda",
    mosquitero: false,
    premarco: false,
    contramarco: false,
  },

  {
    ancho: 40,
    alto: 40,
    color: "blanco",
    tipoVidrio: "4mm",
    modelo: "modelo_inexistente",
    perfil: "amarilla",
    bisagra: "izquierda",
    mosquitero: false,
    premarco: false,
    contramarco: false,
  },
];

casosInvalidos.forEach((input) => {
  try {
    const output = calcularRajaModena(input);

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

const fileName = `rajas_modena_${Date.now()}.json`;

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

console.log("✅ Generator Rajas Modena OK");

console.log("================================");

console.log(`📁 Archivo: ${outputPath}`);

console.log(`📦 Casos generados: ${resultados.length}`);

console.log(`✅ OK: ${ok}`);

console.log(`❌ Errores: ${errores}`);

console.log("================================");
