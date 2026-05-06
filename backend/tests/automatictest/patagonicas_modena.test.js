// backend/tests/automatictest/patagonicas_modena.test.js

const { fromRoot } = require("../../utils/path");

const calcularPatagonicaModena = require(
  fromRoot("wrappers/patagonicas/calcularPatagonicaModena"),
);

console.log("\n🧪 TEST WRAPPER PATAGÓNICA MODENA\n");

// =========================
// 🧪 CASOS
// =========================

const casos = [
  {
    nombre: "base blanca",

    input: {
      medida: "150x100",

      cantidadRajas: 1,

      tipoVidrio: "4mm",

      color: "blanco",
    },
  },

  {
    nombre: "negra dvh",

    input: {
      medida: "150x100",

      cantidadRajas: 1,

      tipoVidrio: "dvh",

      color: "negro",
    },
  },

  {
    nombre: "bronce 2 rajas",

    input: {
      medida: "200x100",

      cantidadRajas: 2,

      tipoVidrio: "dvh_5_9_5",

      color: "bronce",
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

  if (!Array.isArray(result.items)) {
    errores.push("items inválidos");
  }

  if (result.ganancia !== result.precioVenta - result.costo) {
    errores.push("ganancia inconsistente");
  }

  if (!result.configuracion?.svg) {
    errores.push("falta svg");
  }

  return errores;
}

// =========================
// 🚀 RUN
// =========================

casos.forEach((t, i) => {
  try {
    const result = calcularPatagonicaModena(t.input);

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

    console.log("   👉", error.message);
  }
});

console.log("\n✅ FIN TEST WRAPPER\n");
