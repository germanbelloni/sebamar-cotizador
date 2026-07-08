// backend/tests/generators/puertaPlaca.generator.js

const fs = require("fs");
const path = require("path");

const { fromRoot } = require("../../utils/path");

const calcularPuertaPlaca = require(
  fromRoot("wrappers/placas/calcularPuertaPlaca"),
);

const data = require(fromRoot("backend/data/productos/puertas_placa.json"));

// =========================
// 📦 RESULTADOS
// =========================

const resultados = [];

// =========================
// 📁 OUTPUT
// =========================

const outputDir = fromRoot("backend/tests/generated/placas");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, {
    recursive: true,
  });
}

// =========================
// 🚀 GENERADOR
// =========================

Object.keys(data).forEach((tipo) => {
  Object.keys(data[tipo] || {}).forEach((modelo) => {
    Object.keys(data[tipo][modelo] || {}).forEach((medida) => {
      Object.keys(data[tipo][modelo][medida] || {}).forEach((marco) => {
        let input = null;

        try {
          const [ancho, alto] = medida.split("x").map(Number);

          input = {
            ancho,
            alto,
            tipo,
            modelo,
            marco,
          };

          const output = calcularPuertaPlaca(input);

          resultados.push({
            ok: true,
            input,
            output,
          });

          console.log(`✔ ${tipo} | ${modelo} | ${medida} | ${marco}`);
        } catch (error) {
          resultados.push({
            ok: false,
            input: input || {
              tipo,
              modelo,
              medida,
              marco,
            },
            error: error.message,
          });

          console.log(`❌ ${tipo} | ${modelo} | ${medida} | ${marco}`);

          console.log(`👉 ${error.message}`);
        }
      });
    });
  });
});

// =========================
// 🧪 FUERA DE MEDIDA
// =========================

const fueraDeMedida = [
  {
    ancho: 90,
    alto: 200,
    tipo: "placa",
    modelo: "finger_pino",
    marco: "marco_10",
  },

  {
    ancho: 100,
    alto: 205,
    tipo: "placa",
    modelo: "finger_pino",
    marco: "marco_15",
  },

  {
    ancho: 90,
    alto: 205,
    tipo: "placa",
    modelo: "pino_cedro",
    marco: "marco_10",
  },
];

fueraDeMedida.forEach((input) => {
  try {
    const output = calcularPuertaPlaca(input);

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
// 🧪 CASOS INVÁLIDOS
// =========================

const casosInvalidos = [
  {
    ancho: 50,
    alto: 200,
    tipo: "placa",
    modelo: "finger_pino",
    marco: "marco_10",
  },

  {
    ancho: 120,
    alto: 250,
    tipo: "placa",
    modelo: "finger_pino",
    marco: "marco_10",
  },

  {
    ancho: 80,
    alto: 200,
    tipo: "placa",
    modelo: "modelo_inexistente",
    marco: "marco_10",
  },

  {
    ancho: 80,
    alto: 200,
    tipo: "placa",
    modelo: "finger_pino",
    marco: "marco_inexistente",
  },
];

casosInvalidos.forEach((input) => {
  try {
    const output = calcularPuertaPlaca(input);

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

const fileName = `puertaPlaca_${Date.now()}.json`;

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

console.log("✅ Generator Puerta Placa OK");

console.log("================================");

console.log(`📁 Archivo: ${outputPath}`);

console.log(`📦 Casos generados: ${resultados.length}`);

console.log(`✅ OK: ${ok}`);

console.log(`❌ Errores: ${errores}`);

console.log("================================");
