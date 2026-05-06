// backend/tests/automatictest/postigones.service.test.js

const { fromRoot } = require("../../utils/path");

const calcularPostigon = require(
  fromRoot("services/postigones/calcularPostigon"),
);

console.log("\n🧪 TEST SERVICE POSTIGONES\n");

// =========================
// 🧪 CASOS
// =========================

const casos = [
  {
    nombre: "corredizo base",

    input: {
      medida: "120x60",

      tipo: "corredizo",
    },
  },

  {
    nombre: "abrir base",

    input: {
      medida: "120x100",

      tipo: "abrir",
    },
  },

  {
    nombre: "grande corredizo",

    input: {
      medida: "200x100",

      tipo: "corredizo",
    },
  },
];

// =========================
// ✅ VALIDADOR
// =========================

function validar(result) {
  const errores = [];

  if (!result || typeof result !== "object") {
    errores.push("response inválida");

    return errores;
  }

  if (typeof result.costoBase !== "number") {
    errores.push("costoBase inválido");
  }

  if (result.costoBase <= 0) {
    errores.push("costoBase <= 0");
  }

  if (!Array.isArray(result.items)) {
    errores.push("items inválidos");
  }

  return errores;
}

// =========================
// 🚀 RUN
// =========================

casos.forEach((t, i) => {
  try {
    const result = calcularPostigon(t.input);

    const errores = validar(result);

    if (errores.length) {
      console.log(`❌ [${i + 1}] ${t.nombre}`);

      errores.forEach((e) => console.log("   -", e));

      return;
    }

    console.log(`✔️ [${i + 1}] ${t.nombre}`);

    console.log("   👉 costoBase:", result.costoBase);

    console.log("   👉 items:", result.items.length);
  } catch (error) {
    console.log(`💥 [${i + 1}] ${t.nombre}`);

    console.log("   👉", error.message);
  }
});

console.log("\n✅ FIN TEST SERVICE\n");
