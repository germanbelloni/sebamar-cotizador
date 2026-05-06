// backend/tests/automatictest/raja_herrero.test.js

const { fromRoot } = require("../../utils/path");

const calcularRajaHerrero = require(
  fromRoot("wrappers/rajas/calcularRajaHerrero"),
);

console.log("\n🧪 TEST WRAPPER RAJA HERRERO\n");

// =========================
// 🧪 CASOS
// =========================

const casos = [
  {
    nombre: "base",

    input: {
      ancho: 60,

      alto: 60,

      color: "blanco",
    },
  },

  {
    nombre: "con mosquitero",

    input: {
      ancho: 60,

      alto: 60,

      color: "negro",

      mosquitero: true,
    },
  },

  {
    nombre: "con premarco",

    input: {
      ancho: 60,

      alto: 60,

      color: "simil madera",

      premarco: true,
    },
  },

  {
    nombre: "altura alta",

    input: {
      ancho: 60,

      alto: 160,

      color: "blanco",
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
    errores.push("ganancia mal calculada");
  }

  return errores;
}

// =========================
// 🚀 RUN
// =========================

casos.forEach((t, i) => {
  try {
    const result = calcularRajaHerrero(t.input);

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

    console.log("   -", error.message);
  }
});

console.log("\n✅ FIN TEST WRAPPER\n");
