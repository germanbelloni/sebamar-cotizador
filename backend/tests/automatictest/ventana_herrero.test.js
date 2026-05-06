// backend/tests/automatictest/ventana_herrero.test.js

const { fromRoot } = require("../../utils/path");

const calcularVentanaHerrero = require(
  fromRoot("wrappers/ventanas/calcularVentanaHerrero"),
);

console.log("\n🧪 TEST WRAPPER VENTANA HERRERO\n");

// =========================
// 🧪 CASOS
// =========================

const casos = [
  {
    nombre: "base",

    input: {
      ancho: 120,

      alto: 100,

      color: "blanco",
    },
  },

  {
    nombre: "con guia",

    input: {
      ancho: 120,

      alto: 100,

      color: "blanco",

      guia: true,
    },
  },

  {
    nombre: "con mosquitero",

    input: {
      ancho: 120,

      alto: 100,

      color: "negro",

      mosquitero: true,
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

  const tieneEstructura = result.items.some((i) => i.tipo === "estructura");

  if (!tieneEstructura) {
    errores.push("falta estructura");
  }

  const tieneVidrio = result.items.some((i) => i.tipo === "vidrio");

  if (!tieneVidrio) {
    errores.push("falta vidrio");
  }

  if (input.guia) {
    const tieneGuia = result.items.some((i) => i.tipo === "guia");

    if (!tieneGuia) {
      errores.push("falta guia");
    }
  }

  if (input.mosquitero) {
    const tieneMosquitero = result.items.some((i) => i.tipo === "mosquitero");

    if (!tieneMosquitero) {
      errores.push("falta mosquitero");
    }
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
    const result = calcularVentanaHerrero(t.input);

    const errores = validar(result, t.input);

    if (errores.length) {
      console.log(`❌ [${i + 1}] ${t.nombre}`);

      errores.forEach((e) => console.log("   -", e));

      return;
    }

    console.log(`✔️ [${i + 1}] ${t.nombre}`);

    console.log("   👉 venta:", result.precioVenta);

    console.log("   👉 costo:", result.costo);
  } catch (error) {
    console.log(`💥 [${i + 1}] ${t.nombre}`);

    console.log("   👉", error.message);
  }
});

console.log("\n✅ FIN TEST WRAPPER\n");
