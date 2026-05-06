// backend/tests/automatictest/superficies.service.test.js

const { fromRoot } = require("../../utils/path");

const calcularSuperficie = require(
  fromRoot("services/superficies/Superficies"),
);

console.log("\n🧪 TEST SERVICE SUPERFICIES\n");

// =========================
// 🧪 CASOS
// =========================

const casos = [
  {
    nombre: "paño fijo base",

    input: {
      tipo: "pano_fijo",

      ancho: 100,

      alto: 100,

      linea: "herrero",

      tipoVidrio: "4mm",
    },
  },

  {
    nombre: "paño fijo modena",

    input: {
      tipo: "pano_fijo",

      ancho: 120,

      alto: 100,

      linea: "modena",

      tipoVidrio: "dvh",
    },
  },

  {
    nombre: "premarco",

    input: {
      tipo: "premarco",

      ancho: 100,

      alto: 100,
    },
  },

  {
    nombre: "contramarco",

    input: {
      tipo: "contramarco",

      ancho: 100,

      alto: 100,
    },
  },
];

// =========================
// ✅ VALIDADOR
// =========================

function validar(result, input) {
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

  // =========================
  // REGLAS NEGOCIO
  // =========================

  if (input.tipo === "pano_fijo") {
    const tieneVidrio = result.items.some((i) => i.tipo === "vidrio");

    if (!tieneVidrio) {
      errores.push("paño fijo sin vidrio");
    }
  }

  if (input.tipo === "premarco" || input.tipo === "contramarco") {
    const tieneVidrio = result.items.some((i) => i.tipo === "vidrio");

    if (tieneVidrio) {
      errores.push("no debería tener vidrio");
    }
  }

  return errores;
}

// =========================
// 🚀 RUN
// =========================

casos.forEach((t, i) => {
  try {
    const result = calcularSuperficie(t.input);

    const errores = validar(result, t.input);

    if (errores.length) {
      console.log(`❌ [${i + 1}] ${t.nombre}`);

      errores.forEach((e) => console.log("   -", e));

      return;
    }

    console.log(`✔️ [${i + 1}] ${t.nombre}`);

    console.log("   👉 costoBase:", result.costoBase);
  } catch (error) {
    console.log(`💥 [${i + 1}] ${t.nombre}`);

    console.log("   👉", error.message);
  }
});

console.log("\n✅ FIN TEST SERVICE\n");
