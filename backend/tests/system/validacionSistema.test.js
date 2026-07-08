const { fromRoot } = require("../../utils/path");

// =======================
// WRAPPERS
// =======================

const calcularVentanaHerrero = require(
  fromRoot("wrappers/ventanas/calcularVentanaHerrero"),
);

const calcularVentanaModena = require(
  fromRoot("wrappers/ventanas/calcularVentanaModena"),
);

const calcularRajaHerrero = require(
  fromRoot("wrappers/rajas/calcularRajaHerrero"),
);

const calcularRajaModena = require(
  fromRoot("wrappers/rajas/calcularRajaModena"),
);

const calcularPostigones = require(
  fromRoot("wrappers/postigones/calcularPostigones"),
);

const calcularPlacas = require(fromRoot("wrappers/placas/calcularPuertaPlaca"));

const calcularsuperficies = require(
  fromRoot("wrappers/superficies/calcularSuperficies"),
);

const calcularporton = require(fromRoot("wrappers/portones/calcularporton"));

const calcularPatagonicaModena = require(
  fromRoot("wrappers/patagonicas/calcularPatagonicaModena"),
);

const calcularPatagonicaHerrero = require(
  fromRoot("wrappers/patagonicas/calcularPatagonicaHerrero"),
);

// =======================
// 📊 TRACKING
// =======================

let ok = 0;

let fail = 0;

// =======================
// 🧠 VALIDADOR
// =======================

function validar(nombre, fn, input) {
  try {
    const res = fn(input);

    if (!res) {
      throw new Error("sin respuesta");
    }

    if (res.precioVenta !== undefined && res.precioVenta <= 0) {
      throw new Error("precioVenta inválido");
    }

    if (res.costo !== undefined && res.costo <= 0) {
      throw new Error("costo inválido");
    }

    if (!Array.isArray(res.items)) {
      throw new Error("items inválidos");
    }

    if (!res.configuracion) {
      throw new Error("sin configuracion");
    }

    ok++;

    console.log(`✔️ ${nombre}`);
  } catch (e) {
    fail++;

    console.log(`💥 ${nombre}`);

    console.log("   👉", e.message);
  }
}

// =======================
// 🚨 START
// =======================

console.log("\n==============================");

console.log("🧪 VALIDACIÓN SISTEMA");

console.log("==============================\n");

// =======================
// 🪟 VENTANAS
// =======================

validar("Ventana Herrero", calcularVentanaHerrero, {
  ancho: 120,
  alto: 100,
  color: "blanco",
});

validar("Ventana Modena", calcularVentanaModena, {
  ancho: 150,
  alto: 120,
  color: "negro",
  tipoVidrio: "dvh",
});

// =======================
// 🔳 RAJAS
// =======================

validar("Raja Herrero", calcularRajaHerrero, {
  ancho: 60,
  alto: 60,
  color: "blanco",
  tipoVidrio: "4mm",
});

validar("Raja Modena", calcularRajaModena, {
  ancho: 80,
  alto: 80,
  color: "negro",
  tipoVidrio: "3+3",
});

// =======================
// 🧱 POSTIGONES
// =======================

validar("Postigon", calcularPostigones, {
  ancho: 120,
  alto: 100,
  tipo: "abrir",
  color: "blanco",
});

// =======================
// 🚪 PLACAS
// =======================

validar("Puerta Placa", calcularPlacas, {
  ancho: 80,
  alto: 200,
  tipo: "placa",
  modelo: "finger_pino",
  marco: "marco_10",
});

// =======================
// 🧱 superficies
// =======================

validar("Paño Fijo", calcularsuperficies, {
  tipo: "pano_fijo",
  ancho: 100,
  alto: 100,
  linea: "herrero",
  tipoVidrio: "4mm",
});

// =======================
// 🚪 PORTONES
// =======================

validar("Porton", calcularporton, {
  ancho: 240,
  alto: 200,
  hojas: 3,
  sistema: "abrir",
  modelo: "modelo 4",
  linea: "herrero",
  color: "blanco",
  tipoVidrio: "4mm",
  apertura: "izquierda_izquierda",
});

// =======================
// 🏔 PATAGONICAS
// =======================

validar("Patagonica Modena", calcularPatagonicaModena, {
  ancho: 150,
  alto: 100,
  cantidadRajas: 1,
  tipoVidrio: "4mm",
  color: "blanco",
});

validar("Patagonica Herrero", calcularPatagonicaHerrero, {
  medidaTotal: "150x100",

  tipo: "1_raja",

  raja: {
    ancho: 50,
    tipoVidrio: "4mm",
  },

  color: "blanco",
});

// =======================
// 📊 SUMMARY
// =======================

console.log("\n==============================");

console.log("📊 RESUMEN");

console.log("==============================\n");

console.log(`✔ OK: ${ok}`);

console.log(`💥 FAIL: ${fail}`);

// =======================
// 🚨 EXIT
// =======================

if (fail > 0) {
  console.log("\n❌ SISTEMA CON ERRORES\n");

  process.exit(1);
}

console.log("\n✅ SISTEMA OK\n");
