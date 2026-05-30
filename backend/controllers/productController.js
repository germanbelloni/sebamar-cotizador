console.log("🚨 PRODUCT CONTROLLER NUEVO");
const calcularMosquiteroVentana = require("../../wrappers/mosquiteros/calcularMosquiteroVentana");

const calcularPuertaMosquitera = require("../../wrappers/mosquiteros/calcularPuertaMosquitera");

const calcularPatagonicaHerrero = require("../../wrappers/patagonicas/calcularPatagonicaHerrero");

const calcularPatagonicaModena = require("../../wrappers/patagonicas/calcularPatagonicaModena");

const calcularPuertaPlaca = require("../../wrappers/placas/calcularPuertaPlaca");

const calcularporton = require("../../wrappers/portones/calcularporton");

const calcularPostigones = require("../../wrappers/postigones/calcularPostigones");

const calcularPuerta = require("../../wrappers/puertas/calcularPuerta");

const calcularPuertaEco = require("../../wrappers/puertas/calcularPuertaEco");

const calcularRajaHerrero = require("../../wrappers/rajas/calcularRajaHerrero");

const calcularRajaModena = require("../../wrappers/rajas/calcularRajaModena");

const calcularsuperficies = require("../../wrappers/superficies/calcularSuperficies");

const calcularVentanaHerrero = require("../../wrappers/ventanas/calcularVentanaHerrero");

const calcularVentanaModena = require("../../wrappers/ventanas/calcularVentanaModena");

const calcularMosquiteroFijo = require("../../wrappers/mosquiteros/calcularMosquiteroFijo");

const aplicarMargen = require("../utils/pricing/aplicarMargen");

const resolvePricingUser = require("../utils/pricing/resolvePricingUser");

const sanitizarCotizacion = require("../utils/pricing/sanitizarCotizacion");
// =========================
// 🧠 CORE GLOBAL
// =========================

async function runCalculation(req, res, name, callback) {
  try {
    // =========================
    // 🧠 RESULTADO BASE
    // =========================

    const result = await callback();

    // =========================
    // 👤 PRICING USER
    // =========================
    console.log("REQ USER:", req.user);

    const pricingUser = await resolvePricingUser(req.user);
    console.log("PRICING USER:", pricingUser);
    // =========================
    // 💰 MARGEN
    // =========================

    const withMargin = aplicarMargen(
      result,
      Number(pricingUser?.margen || 0),
      pricingUser?.perfil || "",
    );
    console.log("WITH MARGIN:", withMargin);

    // =========================
    // 🔒 SANITIZAR
    // =========================

    const sanitized = sanitizarCotizacion(withMargin, req.user);

    console.log(`✅ ${name}:`, sanitized);

    return res.json(sanitized);
  } catch (error) {
    console.error(`❌ ERROR REAL ${name}:`, error);

    return res.status(500).json({
      error: error.message,
      stack: error.stack,
    });
  }
}

// =========================
// 🚪 PUERTAS
// =========================

function puertas(req, res) {
  return runCalculation(req, res, "PUERTAS", () => calcularPuerta(req.body));
}

function puertasEco(req, res) {
  return runCalculation(req, res, "PUERTAS ECO", () =>
    calcularPuertaEco(req.body),
  );
}

// =========================
// 🪵 PLACAS
// =========================

function placas(req, res) {
  return runCalculation(req, res, "PLACAS", () =>
    calcularPuertaPlaca(req.body),
  );
}

// =========================
// 🧵 MOSQUITEROS
// =========================

function mosquiteros(req, res) {
  const tipo = req.body.tipo;

  if (tipo === "puerta_mosquitera") {
    return runCalculation(req, res, "PUERTA MOSQUITERA", () =>
      calcularPuertaMosquitera(req.body),
    );
  }

  if (tipo === "fijo") {
    return runCalculation(req, res, "MOSQUITERO FIJO", () =>
      calcularMosquiteroFijo(req.body),
    );
  }

  return runCalculation(req, res, "MOSQUITEROS", () =>
    calcularMosquiteroVentana(req.body),
  );
}

// =========================
// 🪟 VENTANAS
// =========================

function ventanas(req, res) {
  const linea = req.body.linea?.toLowerCase();

  if (linea === "modena") {
    return runCalculation(req, res, "VENTANAS MODENA", () =>
      calcularVentanaModena(req.body),
    );
  }

  return runCalculation(req, res, "VENTANAS HERRERO", () =>
    calcularVentanaHerrero(req.body),
  );
}

// =========================
// 🔩 RAJAS
// =========================

function rajas(req, res) {
  const linea = req.body.linea?.toLowerCase();

  const payload = {
    ...req.body,

    modelo: req.body.modelo || req.body.apertura,

    vidrio: req.body.tipoVidrio || req.body.vidrio,
  };

  if (linea === "modena") {
    return runCalculation(req, res, "RAJAS MODENA", () =>
      calcularRajaModena(payload),
    );
  }

  return runCalculation(req, res, "RAJAS HERRERO", () =>
    calcularRajaHerrero(payload),
  );
}

// =========================
// 🪵 POSTIGONES
// =========================

function postigones(req, res) {
  return runCalculation(req, res, "POSTIGONES", () =>
    calcularPostigones(req.body),
  );
}

// =========================
// 🚪 PORTONES
// =========================

function portones(req, res) {
  return runCalculation(req, res, "PORTONES", () => calcularporton(req.body));
}

// =========================
// 🧱 SUPERFICIES
// =========================

function superficies(req, res) {
  return runCalculation(req, res, "SUPERFICIES", () =>
    calcularsuperficies(req.body),
  );
}

// =========================
// 🏔 PATAGONICAS
// =========================

function patagonicas(req, res) {
  const linea = (req.body.linea || "Herrero").toLowerCase();

  const medida = `${req.body.ancho}x${req.body.alto}`;

  const payload = {
    ...req.body,

    linea,

    medida,

    medidaTotal: medida,

    cantidadRajas:
      Number(req.body.cantidadRajas) || (req.body.tipo === "2_rajas" ? 2 : 1),

    anchoRaja: Number(req.body.anchoRaja || 40),
  };

  console.log("PAYLOAD PATAGONICAS:", payload);

  const calculadora =
    linea === "herrero" ? calcularPatagonicaHerrero : calcularPatagonicaModena;

  return runCalculation(req, res, "PATAGONICAS", () => calculadora(payload));
}

module.exports = {
  mosquiteros,

  patagonicas,

  placas,

  postigones,

  portones,

  puertas,

  puertasEco,

  rajas,

  ventanas,

  superficies,
};
