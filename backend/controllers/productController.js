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

const sanitizarResultado = require("../utils/pricing/sanitizarResultado");
const resolvePricingUser = require("../utils/pricing/resolvePricingUser");

// =========================
// 🧠 CORE GLOBAL
// =========================

async function runCalculation(req, res, label, calculate) {
  try {
    const pricingUser = await resolvePricingUser(req.user);

    const data = {
      ...req.body,

      perfil: pricingUser?.perfil || "amarilla",
    };

    console.log("PRICING USER:", pricingUser.nombre);

    console.log("PERFIL USADO:", data.perfil);

    const resultadoBase = calculate(data);

    console.log("RESULTADO BASE:", resultadoBase);

    let resultadoFinal = resultadoBase;

    // 🧑 ADMIN
    if (pricingUser.role === "admin") {
      resultadoFinal = aplicarMargen(resultadoBase, pricingUser.margen);
    }

    resultadoFinal = sanitizarResultado(resultadoFinal, req.user);

    return res.json(resultadoFinal);
  } catch (error) {
    console.log(`ERROR ${label}:`, error.message);

    return res.status(500).json({
      error: "Error en calculo",

      detalle: error.message,
    });
  }
}

// =========================
// 🚪 PUERTAS
// =========================

function puertas(req, res) {
  return runCalculation(req, res, "PUERTAS", (data) => calcularPuerta(data));
}

function puertasEco(req, res) {
  return runCalculation(req, res, "PUERTAS ECO", (data) =>
    calcularPuertaEco(data),
  );
}

// =========================
// 🪵 PLACAS
// =========================

function placas(req, res) {
  return runCalculation(req, res, "PLACAS", (data) =>
    calcularPuertaPlaca(data),
  );
}

// =========================
// 🧵 MOSQUITEROS
// =========================

function mosquiteros(req, res) {
  const tipo = req.body.tipo;

  if (tipo === "puerta_mosquitera") {
    return runCalculation(req, res, "PUERTA MOSQUITERA", (data) =>
      calcularPuertaMosquitera(data),
    );
  }

  if (tipo === "fijo") {
    return runCalculation(req, res, "MOSQUITERO FIJO", (data) =>
      calcularMosquiteroFijo(data),
    );
  }

  return runCalculation(req, res, "MOSQUITEROS", (data) =>
    calcularMosquiteroVentana(data),
  );
}
// =========================
// 🪟 VENTANAS
// =========================

function ventanas(req, res) {
  const linea = req.body.linea?.toLowerCase();

  if (linea === "modena") {
    return runCalculation(req, res, "VENTANAS MODENA", (data) =>
      calcularVentanaModena(data),
    );
  }

  return runCalculation(req, res, "VENTANAS HERRERO", (data) =>
    calcularVentanaHerrero(data),
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
    return runCalculation(req, res, "RAJAS MODENA", (data) =>
      calcularRajaModena(payload),
    );
  }

  return runCalculation(req, res, "RAJAS HERRERO", (data) =>
    calcularRajaHerrero(payload),
  );
}

// =========================
// 🪵 OTROS
// =========================

function postigones(req, res) {
  return runCalculation(req, res, "POSTIGONES", (data) =>
    calcularPostigones(data),
  );
}

function portones(req, res) {
  return runCalculation(req, res, "PORTONES", (data) => calcularporton(data));
}

function superficies(req, res) {
  return runCalculation(req, res, "superficies", (data) =>
    calcularsuperficies(data),
  );
}

// =========================
// 🏔 PATAGÓNICAS
// =========================

function patagonicas(req, res) {
  const linea = req.body.linea?.toLowerCase();

  const payload = {
    ...req.body,

    medida: `${req.body.ancho}x${req.body.alto}`,

    cantidadRajas: req.body.tipo === "2_rajas" ? 2 : 1,
  };

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
