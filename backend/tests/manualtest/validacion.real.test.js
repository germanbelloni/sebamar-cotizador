const { fromRoot } = require("../../utils/path");

// =======================
// WRAPPERS (AJUSTADOS A TU PROYECTO)
// =======================

// PUERTAS
const calcularPuertas = require(fromRoot("wrappers/puertas/calcularPuerta"));

// VENTANAS
const calcularVentanaHerrero = require(
  fromRoot("wrappers/ventanas/calcularVentanaHerrero"),
);
const calcularVentanaModena = require(
  fromRoot("wrappers/ventanas/calcularVentanaModena"),
);

// RAJAS
const calcularRajaHerrero = require(
  fromRoot("wrappers/rajas/calcularRajaHerrero"),
);
const calcularRajaModena = require(
  fromRoot("wrappers/rajas/calcularRajaModena"),
);

// POSTIGONES
const calcularPostigones = require(
  fromRoot("wrappers/postigones/calcularPostigones"),
);

// PLACAS
const calcularPlacas = require(fromRoot("wrappers/placas/calcularPuertaPlaca"));

// PATAGONICAS HERRERO
const calcularPatagonicaHerrero = require(
  fromRoot("wrappers/patagonicas/calcularPatagonicaHerrero")
);

// SUPERFICIES
const calcularSuperficies = require(
  fromRoot("wrappers/superficies/calcularSuperficies"),
);

// PORTONES
const calcularPorton = require(fromRoot("wrappers/portones/calcularporton"));

// PATAGÓNICAS
const calcularPatagonica = require(
  fromRoot("wrappers/patagonicas/calcularPatagonicaModena"),
);

console.log("\n==============================");
console.log("🧪 VALIDACIÓN REAL SISTEMA");
console.log("==============================\n");

// =======================
// 🚪 PUERTAS
// =======================

console.log("🚪 PUERTAS");

console.log("Herrero simple:");
console.log(
  calcularPuertas({
    ancho: 80,
    alto: 200,
    linea: "herrero",
    modelo: "modelo 4",
    color: "blanco",
    tipoVidrio: "4mm",
  }),
);

console.log("Modena DVH:");
console.log(
  calcularPuertas({
    ancho: 80,
    alto: 200,
    linea: "modena",
    modelo: "modelo 4",
    color: "negro",
    tipoVidrio: "dvh",
  }),
);

// =======================
// 🪟 VENTANAS
// =======================

console.log("\n🪟 VENTANAS");

console.log("Herrero:");
console.log(
  calcularVentanaHerrero({
    ancho: 120,
    alto: 100,
    modelo: "corrediza",
    color: "blanco",
  }),
);

console.log("Modena:");
console.log(
  calcularVentanaModena({
    ancho: 150,
    alto: 120,
    modelo: "corrediza",
    color: "negro",
    tipoVidrio: "4mm",
  }),
);

// =======================
// 🔳 RAJAS
// =======================

console.log("Herrero:");
console.log(
  calcularRajaHerrero({
    ancho: 60,
    alto: 60,
    tipo: "1_raja",
    color: "blanco",
    tipoVidrio: "4mm",
  }),
);

console.log("Modena:");
console.log(
  calcularRajaModena({
    ancho: 80,
    alto: 80,
    tipo: "1_raja",
    color: "negro",
    tipoVidrio: "3+3",
  }),
);

// =======================
// 🧱 POSTIGONES
// =======================

console.log("\n🧱 POSTIGONES");

console.log("Abrir:");
console.log(
  calcularPostigones({
    ancho: 120,
    alto: 100,
    tipo: "abrir",
    color: "blanco",
  }),
);

console.log("Corredizo:");
console.log(
  calcularPostigones({
    ancho: 150,
    alto: 120,
    tipo: "corredizo",
    color: "negro",
  }),
);

// =======================
// 🧾 PLACAS
// =======================

console.log("\n🧾 PLACAS");

console.log("Placa:");
console.log(
  calcularPlacas({
    tipo: "placa",
    modelo: "finger_pino",
    medida: "080x200",
    marco: "marco_10",
  }),
);

console.log("Embutir:");
console.log(
  calcularPlacas({
    tipo: "embutir",
    modelo: "cedro_cedro",
    medida: "080x200",
    marco: "marco_10",
  }),
);

// =======================
// 🧱 SUPERFICIES
// =======================

console.log("\n🧱 SUPERFICIES");

console.log("Paño fijo:");
console.log(
  calcularSuperficies({
    tipo: "pano_fijo",
    ancho: 100,
    alto: 100,
    linea: "herrero",
    tipoVidrio: "4mm",
    color: "blanco",
  }),
);

console.log("Contramarco:");
console.log(
  calcularSuperficies({
    tipo: "contramarco",
    ancho: 100,
    alto: 100,
    linea: "herrero",
    color: "negro",
  }),
);

// =======================
// 🚪 PORTONES
// =======================

console.log("\n🚪 PORTONES");

console.log("Abrir:");
console.log(
  calcularPorton({
    ancho: 240,
    alto: 200,
    hojas: 3,
    tipo: "abrir",
    modelo: "modelo 4",
    linea: "herrero",
    color: "blanco",
    tipoVidrio: "4mm",
    apertura: "izquierda_izquierda",
  }),
);

console.log("Corredizo:");
console.log(
  calcularPorton({
    ancho: 300,
    alto: 210,
    hojas: 4,
    tipo: "corredizo",
    modelo: "modelo 4",
    linea: "modena",
    color: "negro",
    tipoVidrio: "4mm",
    apertura: "derecha_izquierda",
  }),
);

// =======================
// 🏔 PATAGÓNICAS
// =======================

console.log("\n🏔 PATAGÓNICAS");

console.log("Base:");
console.log(
  calcularPatagonica({
    ancho: 150,
    alto: 100,
    color: "blanco",
    tipoVidrio: "4mm",
  }),
);

console.log("Negra DVH:");
console.log(
  calcularPatagonica({
    ancho: 150,
    alto: 100,
    color: "negro",
    tipoVidrio: "dvh",
  }),
);

console.log("Patagónica Herrero:");
console.log(calcularPatagonicaHerrero({
  medidaTotal: "150x100",
  tipo: "1_raja",
  raja: { ancho: 50, tipoVidrio: "4mm" },
  color: "blanco"
}));

console.log("\n==============================");
console.log("✅ FIN VALIDACIÓN");
console.log("==============================\n");
