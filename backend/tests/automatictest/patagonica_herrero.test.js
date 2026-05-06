// backend/tests/automatictest/patagonica_herrero.test.js

const { fromRoot } = require("../../utils/path");

const calcularPatagonicaHerrero = require(
  fromRoot("wrappers/patagonicas/calcularPatagonicaHerrero"),
);

console.log("\n🧪 TEST WRAPPER PATAGÓNICA HERRERO\n");

// =========================
// 🧪 CASOS
// =========================

const casos = [
  {
    nombre: "base blanca",

    input: {
      medidaTotal: "150x100",

      tipo: "1_raja",

      color: "blanco",

      raja: {
        tipoVidrio: "4mm",
      },
    },
  },

  {
    nombre: "negra 2 rajas",

    input: {
      medidaTotal: "200x100",

      tipo: "2_rajas",

      color: "negro",

      raja: {
        tipoVidrio: "4mm",
      },
    },
  },

  {
    nombre: "simil madera",

    input: {
      medidaTotal: "200x150",

      tipo: "1_raja",

      color: "simil madera",

      raja: {
        tipoVidrio: "4+4",
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
    const result = calcularPatagonicaHerrero(t.input);

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
