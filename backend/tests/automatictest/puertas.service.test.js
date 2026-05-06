// backend/tests/automatictest/puertas.service.test.js

const { fromRoot } = require("../../utils/path");

const calcularPuertas = require(fromRoot("services/puertas/calcularPuertas"));

console.log("\n🧪 TEST SERVICE PUERTAS\n");

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

      tipoVidrio: "3mm",
    },
  },

  {
    nombre: "herrero fantasia",

    input: {
      linea: "herrero",

      modelo: "modelo 1",

      medida: "80x200",

      tipoVidrio: "fantasia",
    },
  },

  {
    nombre: "modena dvh",

    input: {
      linea: "modena",

      modelo: "modelo 4",

      medida: "90x200",

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
    const result = calcularPuertas(t.input);

    const errores = validar(result);

    if (errores.length) {
      console.log(`❌ [${i + 1}] ${t.nombre}`);

      errores.forEach((e) => console.log("   -", e));

      return;
    }

    console.log(`✔️ [${i + 1}] ${t.nombre}`);

    console.log("   👉 costoBase:", result.costoBase);

    console.log("   👉 items:", result.items.length);
  } catch (error) {
    console.log(`💥 [${i + 1}] ${t.nombre}`);

    console.log("   👉", error.message);
  }
});

console.log("\n✅ FIN TEST SERVICE\n");
