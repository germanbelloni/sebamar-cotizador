// backend/tests/automatictest/postigones.test.js

const { fromRoot } = require("../../utils/path");

const calcularPostigones = require(
  fromRoot("wrappers/postigones/calcularPostigones"),
);

console.log("\n🧪 TEST WRAPPER POSTIGONES\n");

// =========================
// 🧪 CASOS
// =========================

const casos = [
  {
    nombre: "base",

    input: {
      ancho: 120,

      alto: 100,

      tipo: "corredizo",

      color: "blanco",
    },
  },

  {
    nombre: "color negro",

    input: {
      ancho: 120,

      alto: 100,

      tipo: "corredizo",

      color: "negro",
    },
  },

  {
    nombre: "con extras",

    input: {
      ancho: 120,

      alto: 100,

      tipo: "abrir",

      color: "blanco",

      extras: {
        microperforado: true,
      },
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

  // =========================
  // NUMÉRICOS
  // =========================

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

  // =========================
  // ITEMS
  // =========================

  if (!Array.isArray(result.items)) {
    errores.push("items inválidos");
  }

  if (result.items?.length === 0) {
    errores.push("sin items");
  }

  // =========================
  // CONFIG
  // =========================

  if (!result.configuracion) {
    errores.push("sin configuracion");
  }

  if (!result.configuracion?.svg) {
    errores.push("falta svg");
  }

  // =========================
  // CONSISTENCIA
  // =========================

  if (result.precioVenta < result.costo) {
    errores.push("venta menor a costo");
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
    const result = calcularPostigones(t.input);

    const errores = validar(result);

    if (errores.length) {
      console.log(`❌ [${i + 1}] ${t.nombre}`);

      errores.forEach((e) => console.log("   -", e));

      return;
    }

    console.log(`✔️ [${i + 1}] ${t.nombre}`);

    console.log("   👉 venta:", result.precioVenta);

    console.log("   👉 costo:", result.costo);
  } catch (error) {
    console.log(`💥 [${i + 1}] ${t.nombre}`);

    console.log("   👉", error.message);
  }
});

console.log("\n✅ FIN TEST\n");
