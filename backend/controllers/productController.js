const calcularMosquiteroVentana = require("../../wrappers/mosquiteros/calcularMosquiteroVentana");

const calcularPuertaMosquitera = require("../../wrappers/mosquiteros/calcularPuertaMosquitera");

const calcularPatagonicaHerrero = require("../../wrappers/patagonicas/calcularPatagonicaHerrero");

const calcularPatagonicaModena = require("../../wrappers/patagonicas/calcularPatagonicaModena");

const calcularPuertaPlaca = require("../../wrappers/placas/calcularPuertaPlaca");

const calcularPorton = require("../../wrappers/portones/calcularPorton");

const calcularPostigones = require("../../wrappers/postigones/calcularPostigones");

const calcularPuerta = require("../../wrappers/puertas/calcularPuerta");

const calcularPuertaEco = require("../../wrappers/puertas/calcularPuertaEco");

const calcularRajaHerrero = require("../../wrappers/rajas/calcularRajaHerrero");

const calcularRajaModena = require("../../wrappers/rajas/calcularRajaModena");

const calcularSuperficies = require("../../wrappers/superficies/calcularSuperficies");

const calcularVentanaHerrero = require("../../wrappers/ventanas/calcularVentanaHerrero");

const calcularVentanaModena = require("../../wrappers/ventanas/calcularVentanaModena");

// =========================
// 🧠 CORE GLOBAL
// =========================

function runCalculation(req, res, label, calculate) {
  try {
    const data = {
      ...req.body,

      perfil: req.user?.perfil || "MODENA",
    };

    console.log("PERFIL USADO:", data.perfil);

    const resultadoBase = calculate(data);

    console.log("RESULTADO BASE:", resultadoBase);

    const resultadoFinal = resultadoBase;

    console.log("RESULTADO FINAL:", resultadoFinal);

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
  return runCalculation(req, res, "MOSQUITEROS", (data) =>
    calcularMosquiteroVentana(data),
  );
}

function puertaMosquitera(req, res) {
  return runCalculation(req, res, "PUERTA MOSQUITERA", (data) =>
    calcularPuertaMosquitera(data),
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

  if (linea === "modena") {
    return runCalculation(req, res, "RAJAS MODENA", (data) =>
      calcularRajaModena(data),
    );
  }

  return runCalculation(req, res, "RAJAS HERRERO", (data) =>
    calcularRajaHerrero(data),
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
  return runCalculation(req, res, "PORTONES", (data) => calcularPorton(data));
}

function superficies(req, res) {
  return runCalculation(req, res, "SUPERFICIES", (data) =>
    calcularSuperficies(data),
  );
}

// =========================
// 🏔 PATAGÓNICAS
// =========================

function patagonicas(req, res) {
  const linea = req.body.linea?.toLowerCase();

  const calculadora =
    linea === "herrero" ? calcularPatagonicaHerrero : calcularPatagonicaModena;

  return runCalculation(req, res, "PATAGONICAS", (data) => calculadora(data));
}

module.exports = {
  mosquiteros,

  puertaMosquitera,

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
