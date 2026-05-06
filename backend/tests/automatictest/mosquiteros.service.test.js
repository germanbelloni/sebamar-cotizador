// backend/tests/automatictest/mosquiteros.service.test.js

const { fromRoot } = require("../../utils/path");

const calcularMosquitero = require(
  fromRoot("backend/services/mosquiteros/calcularMosquitero"),
);

console.log("\n🧪 TEST SERVICE MOSQUITEROS\n");

// =========================
// 🧪 CASOS
// =========================

const casos = [
  {
    nombre: "base blanco",

    input: {
      medida: "100x0,50",

      color: "blanco",
    },
  },

  {
    nombre: "color negro",

    input: {
      medida: "100x0,50",

      color: "negro",
    },
  },

  {
    nombre: "color simil madera",

    input: {
      medida: "120x0,50",

      color: "simil madera",
    },
  },
];

// =========================
// 🚀 TEST
// =========================

casos.forEach((test, i) => {
  try {
    const result = calcularMosquitero(test.input);

    // =========================
    // ✅ VALIDACIONES
    // =========================

    if (!result || typeof result !== "object") {
      throw new Error("response inválida");
    }

    if (!result.costoBase || result.costoBase <= 0) {
      throw new Error("costoBase inválido");
    }

    if (!Array.isArray(result.items)) {
      throw new Error("items inválidos");
    }

    console.log(`✔️ [${i + 1}] ${test.nombre}`);

    console.log("   👉 costoBase:", result.costoBase);

    console.log("   👉 items:", result.items.length);
  } catch (error) {
    console.log(`💥 [${i + 1}] ${test.nombre}`);

    console.log("   👉", error.message);
  }
});

console.log("\n✅ FIN TEST SERVICE\n");
