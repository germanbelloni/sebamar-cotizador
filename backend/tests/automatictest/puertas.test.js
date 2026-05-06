// backend/tests/automatictest/puertas.test.js

const { fromRoot } = require("../../utils/path");

const calcularPuerta = require(fromRoot("wrappers/puertas/calcularPuerta"));

console.log("\n🧪 TEST WRAPPER PUERTAS\n");

// =========================
// 🧪 CASOS
// =========================

const casos = [
  {
    nombre: "modena base",

    input: {
      linea: "modena",

      modelo: "modelo 3",

      medida: "80x200",

      color: "negro",

      tipoVidrio: "3mm",

      perfil: "azul",
    },
  },

  {
    nombre: "herrero fantasia",

    input: {
      linea: "herrero",

      modelo: "modelo 1",

      medida: "80x200",

      color: "blanco",

      tipoVidrio: "fantasia",

      perfil: "amarilla",
    },
  },

  {
    nombre: "modena dvh barral",

    input: {
      linea: "modena",

      modelo: "modelo 4",

      medida: "90x200",

      color: "negro",

      tipoVidrio: "dvh",

      barral: true,

      perfil: "azul",
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
    const result = calcularPuerta(t.input);

    const errores = validar(result);

    if (errores.length) {
      console.log(`❌ [${i + 1}] ${t.nombre}`);

      errores.forEach((e) => console.log("   -", e));

      return;
    }

    console.log(`✔️ [${i + 1}] ${t.nombre}`);

    console.log("   👉 venta:", result.precioVenta);

    console.log("   👉 costo:", result.costo);

    console.log("   👉 ganancia:", result.ganancia);
  } catch (error) {
    console.log(`💥 [${i + 1}] ${t.nombre}`);

    console.log("   👉", error.message);
  }
});

console.log("\n✅ FIN TEST WRAPPER\n");
