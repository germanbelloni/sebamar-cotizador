// backend/tests/automatictest/ventana_modena.service.test.js

const { fromRoot } = require("../../utils/path");

const calcularVentana = require(fromRoot("services/ventanas/calcularVentana"));

console.log("\n🧪 TEST SERVICE VENTANA MODENA\n");

// =========================
// 🧪 CASOS
// =========================

const casos = [
  {
    nombre: "base",

    input: {
      medida: "120x100",

      tipoVidrio: "4mm",

      linea: "modena",
    },
  },

  {
    nombre: "dvh",

    input: {
      medida: "120x100",

      tipoVidrio: "dvh",

      linea: "modena",
    },
  },

  {
    nombre: "laminado 3+3",

    input: {
      medida: "150x100",

      tipoVidrio: "3+3",

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
    errores.push("sin respuesta");

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

  const tieneEstructura = result.items.some((i) => i.tipo === "estructura");

  if (!tieneEstructura) {
    errores.push("falta estructura");
  }

  const tieneVidrio = result.items.some((i) => i.tipo === "vidrio");

  if (!tieneVidrio) {
    errores.push("falta vidrio");
  }

  return errores;
}

// =========================
// 🚀 RUN
// =========================

casos.forEach((t, i) => {
  try {
    const result = calcularVentana(t.input);

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

console.log("\n✅ FIN TEST SERVICE\n"); // backend/tests/automatictest/ventana_modena.service.test.js

const { fromRoot } = require("../../utils/path");

const calcularVentana = require(fromRoot("services/ventanas/calcularVentana"));

console.log("\n🧪 TEST SERVICE VENTANA MODENA\n");

// =========================
// 🧪 CASOS
// =========================

const casos = [
  {
    nombre: "base",

    input: {
      medida: "120x100",

      tipoVidrio: "4mm",

      linea: "modena",
    },
  },

  {
    nombre: "dvh",

    input: {
      medida: "120x100",

      tipoVidrio: "dvh",

      linea: "modena",
    },
  },

  {
    nombre: "laminado 3+3",

    input: {
      medida: "150x100",

      tipoVidrio: "3+3",

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
    errores.push("sin respuesta");

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

  const tieneEstructura = result.items.some((i) => i.tipo === "estructura");

  if (!tieneEstructura) {
    errores.push("falta estructura");
  }

  const tieneVidrio = result.items.some((i) => i.tipo === "vidrio");

  if (!tieneVidrio) {
    errores.push("falta vidrio");
  }

  return errores;
}

// =========================
// 🚀 RUN
// =========================

casos.forEach((t, i) => {
  try {
    const result = calcularVentana(t.input);

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
