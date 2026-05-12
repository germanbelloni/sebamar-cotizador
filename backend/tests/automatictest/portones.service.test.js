// backend/tests/automatictest/portones.service.test.js

const { fromRoot } = require("../../utils/path");

const calcularportones = require(
  fromRoot("backend/services/portones/calcularportones"),
);

console.log("\n🧪 TEST SERVICE PORTONES\n");

// =========================
// 🧪 CASOS
// =========================

const casos = [
  {
    nombre: "modena base",

    input: {
      ancho: 240,

      alto: 200,

      hojas: 3,

      linea: "modena",

      modelo: "modelo 3",

      tipoVidrio: "3mm",
    },
  },

  {
    nombre: "herrero simple",

    input: {
      ancho: 200,

      alto: 200,

      hojas: 2,

      linea: "herrero",

      modelo: "modelo 4",

      tipoVidrio: "4mm",
    },
  },

  {
    nombre: "grande dvh",

    input: {
      ancho: 320,

      alto: 220,

      hojas: 4,

      linea: "modena",

      modelo: "modelo 4",

      tipoVidrio: "dvh",
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
    const result = calcularportones(t.input);

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

    console.log("   👉 ERROR:", error.message);
  }
});

console.log("\n✅ FIN TEST SERVICE\n");
