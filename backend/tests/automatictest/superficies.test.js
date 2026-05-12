// backend/tests/automatictest/superficies.test.js

const { fromRoot } = require("../../utils/path");

const calcularsuperficies = require(
  fromRoot("wrappers/superficies/calcularsuperficies"),
);

console.log("\n🧪 TEST WRAPPER superficies\n");

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
    nombre: "paño fijo negro",

    input: {
      tipo: "pano_fijo",

      ancho: 120,

      alto: 100,

      linea: "herrero",

      tipoVidrio: "4mm",

      color: "negro",
    },
  },

  {
    nombre: "premarco",

    input: {
      tipo: "premarco",

      ancho: 120,

      alto: 100,
    },
  },

  {
    nombre: "contramarco negro",

    input: {
      tipo: "contramarco",

      ancho: 150,

      alto: 100,

      color: "negro",
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
    const result = calcularsuperficies(t.input);

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

console.log("\n✅ FIN TEST WRAPPER\n"); // backend/tests/automatictest/superficies.test.js

const { fromRoot } = require("../../utils/path");

const calcularsuperficies = require(
  fromRoot("wrappers/superficies/calcularsuperficies"),
);

console.log("\n🧪 TEST WRAPPER superficies\n");

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
    nombre: "paño fijo negro",

    input: {
      tipo: "pano_fijo",

      ancho: 120,

      alto: 100,

      linea: "herrero",

      tipoVidrio: "4mm",

      color: "negro",
    },
  },

  {
    nombre: "premarco",

    input: {
      tipo: "premarco",

      ancho: 120,

      alto: 100,
    },
  },

  {
    nombre: "contramarco negro",

    input: {
      tipo: "contramarco",

      ancho: 150,

      alto: 100,

      color: "negro",
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
    const result = calcularsuperficies(t.input);

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
