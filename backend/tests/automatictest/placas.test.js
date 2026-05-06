// backend/tests/automatictest/placas.test.js

const { fromRoot } = require("../../utils/path");

const calcularPuertaPlaca = require(
  fromRoot("wrappers/placas/calcularPuertaPlaca"),
);

console.log("\n🧪 TEST WRAPPER PLACAS\n");

// =========================
// 🧪 CASOS
// =========================

const casos = [
  {
    nombre: "base simple",

    input: {
      ancho: 80,

      alto: 200,

      tipo: "placa",

      modelo: "finger_pino",

      marco: "marco_10",
    },
  },

  {
    nombre: "con recargo ancho",

    input: {
      ancho: 90,

      alto: 200,

      tipo: "placa",

      modelo: "finger_pino",

      marco: "marco_10",
    },
  },

  {
    nombre: "con recargo alto",

    input: {
      ancho: 80,

      alto: 205,

      tipo: "placa",

      modelo: "finger_pino",

      marco: "marco_10",
    },
  },

  {
    nombre: "mano izquierda (svg)",

    input: {
      ancho: 80,

      alto: 200,

      tipo: "placa",

      modelo: "finger_pino",

      marco: "marco_10",

      mano: "izquierda",
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

  if (typeof result.costo !== "number") {
    errores.push("costo inválido");
  }

  if (typeof result.precioVenta !== "number") {
    errores.push("precioVenta inválido");
  }

  if (typeof result.ganancia !== "number") {
    errores.push("ganancia inválida");
  }

  if (!Array.isArray(result.items)) {
    errores.push("items inválidos");
  }

  if (!result.configuracion?.svg) {
    errores.push("falta svg");
  }

  if (result.ganancia !== result.precioVenta - result.costo) {
    errores.push("ganancia inconsistente");
  }

  return errores;
}

// =========================
// 🚀 RUN
// =========================

casos.forEach((t, i) => {
  try {
    const result = calcularPuertaPlaca(t.input);

    const errores = validar(result);

    if (errores.length) {
      console.log(`❌ [${i + 1}] ${t.nombre}`);

      errores.forEach((e) => console.log("   -", e));

      return;
    }

    console.log(`✔️ [${i + 1}] ${t.nombre}`);

    console.log("   👉 precioVenta:", result.precioVenta);
  } catch (error) {
    console.log(`💥 [${i + 1}] ${t.nombre}`);

    console.log("   -", error.message);
  }
});

console.log("\n✅ FIN TEST WRAPPER\n");
