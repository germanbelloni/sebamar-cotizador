// backend/tests/automatictest/ventana_modena.test.js

const { fromRoot } = require("../../utils/path");

const calcularVentanaModena = require(
  fromRoot("wrappers/ventanas/calcularVentanaModena"),
);

console.log("\n🧪 TEST WRAPPER VENTANA MODENA\n");

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

      tipoVidrio: "4mm",
    },
  },

  {
    nombre: "completa negra",

    input: {
      ancho: 200,

      alto: 150,

      color: "negro",

      tipoVidrio: "dvh",

      mosquitero: true,

      premarco: true,

      contramarco: true,
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

  if (input.mosquitero) {
    const tieneMosquitero = result.items.some((i) => i.tipo === "mosquitero");

    if (!tieneMosquitero) {
      errores.push("falta mosquitero");
    }
  }

  if (input.premarco) {
    const tienePremarco = result.items.some((i) => i.tipo === "premarco");

    if (!tienePremarco) {
      errores.push("falta premarco");
    }
  }

  if (input.contramarco) {
    const tieneContramarco = result.items.some((i) => i.tipo === "contramarco");

    if (!tieneContramarco) {
      errores.push("falta contramarco");
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
    const result = calcularVentanaModena(t.input);

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
