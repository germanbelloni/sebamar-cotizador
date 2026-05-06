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
const calcularSuperficies = require(
  fromRoot("wrappers/superficies/calcularSuperficies"),
);
const calcularPorton = require(fromRoot("wrappers/portones/calcularporton"));
const calcularPatagonicaModena = require(
  fromRoot("wrappers/patagonicas/calcularPatagonicaModena"),
);
const calcularPatagonicaHerrero = require(
  fromRoot("wrappers/patagonicas/calcularPatagonicaHerrero"),
);

// =======================
// 🧠 VALIDADOR GENERAL
// =======================
function validar(nombre, fn, input) {
  try {
    const res = fn(input);

    if (!res) throw new Error("sin respuesta");

    if (res.precioVenta !== undefined && res.precioVenta <= 0) {
      throw new Error("precioVenta inválido");
    }

    if (res.total !== undefined && res.total <= 0) {
      throw new Error("total inválido");
    }

    console.log(`✔️ ${nombre}`);
  } catch (e) {
    console.log(`💥 ${nombre}`);
    console.log("   👉", e.message);
  }
}

console.log("\n==============================");
console.log("🧪 VALIDACIÓN REAL SISTEMA");
console.log("==============================\n");

// =======================
// 🪟 VENTANAS
// =======================

validar("Ventana Herrero base", calcularVentanaHerrero, {
  ancho: 120,
  alto: 100,
  color: "blanco",
});

validar("Ventana Modena DVH", calcularVentanaModena, {
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

validar("Postigon abrir", calcularPostigones, {
  ancho: 120,
  alto: 100,
  tipo: "abrir",
  color: "blanco",
});

// =======================
// 🧾 PLACAS
// =======================

validar("Placa base", calcularPlacas, {
  ancho: 80,
  alto: 200,
  tipo: "placa",
  modelo: "finger_pino",
  marco: "marco_10",
});

// =======================
// 🧱 SUPERFICIES
// =======================

validar("Paño fijo", calcularSuperficies, {
  tipo: "pano_fijo",
  ancho: 100,
  alto: 100,
  linea: "herrero",
  tipoVidrio: "4mm",
});

// =======================
// 🚪 PORTONES
// =======================

validar("Porton abrir", calcularPorton, {
  ancho: 240,
  alto: 200,
  hojas: 3,
  tipo: "abrir",
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
  tipoRaja: 50,
  cantidadRajas: 1,
  tipoVidrio: "4mm",
  color: "blanco",
});

validar("Patagonica Herrero", calcularPatagonicaHerrero, {
  medidaTotal: "150x100",
  tipo: "1_raja",
  raja: { ancho: 50, tipoVidrio: "4mm" },
  color: "blanco",
});

console.log("\n==============================");
console.log("✅ FIN VALIDACIÓN");
console.log("==============================\n");
