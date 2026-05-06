// backend/tests/automatictest/raja_modena.service.test.js

const { fromRoot } = require("../../utils/path");

const calcularRaja = require(fromRoot("services/rajas/calcularRaja"));

console.log("\n🧪 TEST SERVICE RAJA MODENA\n");

// =========================
// 🧪 CASOS
// =========================

const casos = [
  {
    nombre: "base",

    input: {
      medida: "60x60",

      tipoVidrio: "4mm",

      linea: "modena",
    },
  },

  {
    nombre: "dvh",

    input: {
      medida: "60x60",

      tipoVidrio: "dvh",

      linea: "modena",
    },
  },

  {
    nombre: "laminado 4+4",

    input: {
      medida: "80x60",

      tipoVidrio: "4+4",

      linea: "modena",
    },
  },

  {
    nombre: "dvh 5+9+5",

    input: {
      medida: "100x60",

      tipoVidrio: "dvh_5_9_5",

      linea: "modena",
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
    const result = calcularRaja(t.input);

    const errores = validar(result);

    if (errores.length) {
      console.log(`❌ [${i + 1}] ${t.nombre}`);

      errores.forEach((e) => console.log("   -", e));

      return;
    }

    console.log(`✔️ [${i + 1}] ${t.nombre}`);

    console.log("   👉 costoBase:", result.costoBase);
  } catch (error) {
    console.log(`💥 [${i + 1}] ${t.nombre}`);

    console.log("   -", error.message);
  }
});

console.log("\n✅ FIN TEST SERVICE\n");
