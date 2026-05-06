const { fromRoot } = require("../../utils/path");

const calcularVentanaHerrero = require(
  fromRoot("wrappers/ventanas/calcularVentanaHerrero"),
);

console.log("\n🧪 TEST WRAPPER VENTANA HERRERO\n");

// =========================
// CASOS
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
      color: "blanco",
      mosquitero: true,
    },
  },
  {
    nombre: "con cortina pvc",
    input: {
      ancho: 120,
      alto: 100,
      color: "blanco",
      guia: true,
      cortina: "pvc",
    },
  },
  {
    nombre: "cajon block (sin guia)",
    input: {
      ancho: 120,
      alto: 100,
      color: "blanco",
      cajonBlock: true,
    },
  },
  {
    nombre: "color negro",
    input: {
      ancho: 120,
      alto: 100,
      color: "negro",
    },
  },
];

// =========================
// VALIDADOR
// =========================
function validar(res, input) {
  const errores = [];

  // estructura
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
  // REGLAS
  // =========================

  // guia
  if (input.guia) {
    const tiene = res.items.some((i) => i.tipo === "guia");
    if (!tiene) errores.push("falta item guia");
  }

  // mosquitero
  if (input.mosquitero) {
    const tiene = res.items.some((i) => i.tipo === "mosquitero");
    if (!tiene) errores.push("falta item mosquitero");
  }

  // cortina
  if (input.cortina) {
    const tiene = res.items.some((i) => i.tipo === "cortina");
    if (!tiene) errores.push("falta item cortina");
  }

  // cajon block
  if (input.cajonBlock) {
    const tiene = res.items.some((i) => i.tipo === "cajon_block");
    if (!tiene) errores.push("falta item cajon_block");
  }

  // coherencia números
  const sumaItems = res.items.reduce((acc, i) => acc + (i.precio || 0), 0);

  if (res.costoBase && sumaItems < res.costoBase) {
    errores.push("items no cubren costoBase");
  }

  if (res.precioVenta < res.costo) {
    errores.push("venta menor a costo");
  }

  if (res.ganancia !== res.precioVenta - res.costo) {
    errores.push("ganancia inconsistente");
  }

  // svg (clave para front)
  if (!res.configuracion?.svg) {
    errores.push("falta svg");
  }

  return errores;
}

// =========================
// RUN
// =========================
casos.forEach((t, i) => {
  try {
    const r = calcularVentanaHerrero(t.input);

    const errores = validar(r, t.input);

    if (errores.length) {
      console.log(`❌ [${i + 1}] ${t.nombre}`);
      errores.forEach((e) => console.log("   -", e));
    } else {
      console.log(`✔️ [${i + 1}] ${t.nombre}`);
    }
  } catch (e) {
    console.log(`💥 [${i + 1}] ${t.nombre}`);
    console.log("   👉", e.message);
  }
});

console.log("\n✅ FIN TEST WRAPPER\n");
