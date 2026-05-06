const { fromRoot } = require("../../utils/path");

const calcularPorton = require(fromRoot("wrappers/portones/calcularporton"));

console.log("\n🧪 TEST WRAPPER PORTONES\n");

// =========================
// CASOS
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
    nombre: "portón grande con recargo altura",
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
// VALIDADOR PRO
// =========================
function validar(res, input) {
  const errores = [];

  // =========================
  // ESTRUCTURA
  // =========================
  if (typeof res.precioVenta !== "number") {
    errores.push("precioVenta inválido");
  }

  if (typeof res.costo !== "number") {
    errores.push("costo inválido");
  }

  if (typeof res.ganancia !== "number") {
    errores.push("ganancia inválida");
  }

  if (!Array.isArray(res.items)) {
    errores.push("items no es array");
  }

  // =========================
  // ITEMS
  // =========================
  if (res.items.length === 0) {
    errores.push("sin items");
  }

  const tieneBase = res.items.some((i) => i.tipo === "base");

  if (!tieneBase) {
    errores.push("falta item base");
  }

  // =========================
  // CONSISTENCIA NUMÉRICA
  // =========================
  if (res.precioVenta < res.costo) {
    errores.push("venta menor a costo");
  }

  if (res.ganancia !== res.precioVenta - res.costo) {
    errores.push("ganancia inconsistente");
  }

  // =========================
  // CONFIG
  // =========================
  if (!res.configuracion) {
    errores.push("sin configuracion");
  }

  if (!res.configuracion?.ancho || !res.configuracion?.alto) {
    errores.push("configuracion incompleta");
  }

  // =========================
  // SVG (CLAVE FRONT)
  // =========================
  if (!res.configuracion?.svg) {
    errores.push("falta svg");
  } else {
    if (!res.configuracion.svg.layout) {
      errores.push("svg sin layout");
    }

    if (!res.configuracion.svg.svgKey) {
      errores.push("svg sin svgKey");
    }
  }

  // =========================
  // REGLAS DE NEGOCIO
  // =========================

  // hojas coherentes
  if (input.hojas && res.configuracion?.hojas) {
    if (res.configuracion.hojas !== input.hojas) {
      errores.push("hojas no coinciden");
    }
  }

  return errores;
}

// =========================
// RUN
// =========================
casos.forEach((t, i) => {
  try {
    const r = calcularPorton(t.input);

    const errores = validar(r, t.input);

    if (errores.length) {
      console.log(`❌ [${i + 1}] ${t.nombre}`);
      errores.forEach((e) => console.log("   -", e));
    } else {
      console.log(`✔️ [${i + 1}] ${t.nombre}`);
      console.log("   👉 venta:", r.precioVenta);
      console.log("   👉 costo:", r.costo);
      console.log("   👉 ganancia:", r.ganancia);
    }
  } catch (e) {
    console.log(`💥 [${i + 1}] ${t.nombre}`);
    console.log("   👉 ERROR:", e.message);
  }
});

console.log("\n✅ FIN TEST WRAPPER\n");
