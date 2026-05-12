// backend/tests/automatictest/portones.test.js

const { fromRoot } = require("../../utils/path");

const calcularporton = require(fromRoot("wrappers/portones/calcularporton"));

console.log("\n🧪 TEST WRAPPER PORTONES\n");

// =========================
// 🧪 CASOS
// =========================

const casos = [
  {
    nombre: "portón base abrir",

    input: {
      ancho: 240,

      alto: 200,

      hojas: 3,

      tipo: "abrir",

      modelo: "modelo 4",

      linea: "herrero",

      color: "blanco",

      tipoVidrio: "4mm",

      apertura: "izquierda_izquierda",
    },
  },

  {
    nombre: "portón corredizo negro",

    input: {
      ancho: 300,

      alto: 210,

      hojas: 4,

      tipo: "corredizo",

      modelo: "modelo 4",

      linea: "modena",

      color: "negro",

      tipoVidrio: "4mm",

      apertura: "derecha_izquierda",
    },
  },

  {
    nombre: "portón grande",

    input: {
      ancho: 320,

      alto: 220,

      hojas: 4,

      tipo: "corredizo",

      modelo: "modelo 4",

      linea: "herrero",

      color: "blanco",
    },
  },
];

// =========================
// ✅ VALIDADOR
// =========================

function validar(result, input) {
  const errores = [];

  // =========================
  // RESPONSE
  // =========================

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

  const tieneBase = result.items?.some((i) => i.tipo === "base");

  if (!tieneBase) {
    errores.push("falta item base");
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

  // =========================
  // CONFIG
  // =========================

  if (!result.configuracion) {
    errores.push("sin configuracion");
  }

  if (!result.configuracion?.ancho || !result.configuracion?.alto) {
    errores.push("configuracion incompleta");
  }

  // =========================
  // SVG
  // =========================

  if (!result.configuracion?.svg) {
    errores.push("falta svg");
  } else {
    if (!result.configuracion.svg.layout) {
      errores.push("svg sin layout");
    }

    if (!result.configuracion.svg.svgKey) {
      errores.push("svg sin svgKey");
    }
  }

  // =========================
  // HOJAS
  // =========================

  if (input.hojas && result.configuracion?.hojas) {
    if (result.configuracion.hojas !== input.hojas) {
      errores.push("hojas no coinciden");
    }
  }

  return errores;
}

// =========================
// 🚀 RUN
// =========================

casos.forEach((t, i) => {
  try {
    const result = calcularporton(t.input);

    const errores = validar(result, t.input);

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

    console.log("   👉 ERROR:", error.message);
  }
});

console.log("\n✅ FIN TEST WRAPPER\n");
