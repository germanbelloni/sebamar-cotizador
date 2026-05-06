// backend/tests/automatictest/patagonicas_modena.service.test.js

const { fromRoot } = require("../../utils/path");

const calcularPatagonicaModena = require(
  fromRoot("services/patagonicas/calcularPatagonicaModena"),
);

console.log("\n🧪 TEST SERVICE PATAGÓNICA MODENA\n");

// =========================
// 🧪 CASOS
// =========================

const casos = [
  {
    nombre: "base 4mm",

    input: {
      tipo: "1_raja",

      medida: "150x100",

      tipoVidrio: "4mm",
    },
  },

  {
    nombre: "negra dvh",

    input: {
      tipo: "1_raja",

      medida: "150x100",

      tipoVidrio: "dvh",
    },
  },

  {
    nombre: "dvh 5+9+5",

    input: {
      tipo: "2_rajas",

      medida: "200x100",

      tipoVidrio: "dvh_5_9_5",
    },
  },

  {
    nombre: "laminado 4+4",

    input: {
      tipo: "1_raja",

      medida: "150x150",

      tipoVidrio: "4+4",
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
    const result = calcularPatagonicaModena(t.input);

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

    console.log("   👉", error.message);
  }
});

console.log("\n✅ FIN TEST SERVICE\n");
