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

const auditarResultado = require("../auditor/auditarResultado");
const logAuditoria = require("../auditor/logAuditoria");

const calcularVentanaAbrir = require("../../wrappers/ventanasAbrir/calcularVentanaAbrir");

function isValidationError(message = "") {
  const text = String(message).toLowerCase();

  return (
    text.includes("falta") ||
    text.includes("inválid") ||
    text.includes("invalida") ||
    text.includes("inválida") ||
    text.includes("rango") ||
    text.includes("medida") ||
    text.includes("ancho") ||
    text.includes("alto") ||
    text.includes("guía") ||
    text.includes("guia") ||
    text.includes("cortina") ||
    text.includes("cajón") ||
    text.includes("cajon")
  );
}
// =========================
// 🧠 CORE GLOBAL
// =========================

async function runCalculation(req, res, name, callback) {
  try {
    const payload = {
      ...req.body,
      perfil: req.user.perfil,
    };
    console.log("PAYLOAD RUNCALC:");
    console.log(payload);

    const result = await callback(payload);

    const pricingUser = await resolvePricingUser(req.user);

    const withMargin = aplicarMargen(
      result,
      Number(pricingUser?.margen || 0),
      pricingUser?.perfil || "",
    );

    const sanitized = sanitizarCotizacion(withMargin, req.user);

    const auditoria = auditarResultado(withMargin);

    logAuditoria(name, req.user, req.body, sanitized, auditoria);

    console.log("========== AUDITOR ==========");
    console.dir(auditoria, { depth: null });
    console.log("");
    console.log("======================================");
    console.log(`AUDITOR ${name}`);
    console.log("======================================");

    auditoria.ok.forEach((m) => console.log(m));

    auditoria.advertencias.forEach((m) => console.log("⚠", m));

    auditoria.errores.forEach((m) => console.log("❌", m));

    console.log("--------------------------------------");
    console.log(
      auditoria.valido ? "✅ RESULTADO: APROBADO" : "❌ RESULTADO: RECHAZADO",
    );
    console.log("======================================");
    console.log("");
    console.log("========== BACK RESPONSE ==========");
    console.log(JSON.stringify(sanitized, null, 2));
    return res.json(sanitized);
  } catch (error) {
    if (isValidationError(error.message)) {
      console.warn(`⚠️ VALIDATION ${name}: ${error.message}`);

      return res.status(400).json({
        error: error.message,
      });
    }

    console.error(`❌ ERROR REAL ${name}:`, error);

    return res.status(500).json({
      error: "Error interno del servidor",
    });
  }
}

// =========================
// 🚪 PUERTAS
// =========================

function puertas(req, res) {
  return runCalculation(req, res, "PUERTAS", (payload) =>
    calcularPuerta(payload),
  );
}

function puertasEco(req, res) {
  return runCalculation(req, res, "PUERTAS ECO", (payload) =>
    calcularPuertaEco(payload),
  );
}

// =========================
// 🪵 PLACAS
// =========================

function placas(req, res) {
  return runCalculation(req, res, "PLACAS", (payload) =>
    calcularPuertaPlaca(payload),
  );
}

// =========================
// 🧵 MOSQUITEROS
// =========================

function mosquiteros(req, res) {
  const tipo = req.body.tipo;

  if (tipo === "puerta_mosquitera") {
    return runCalculation(req, res, "PUERTA MOSQUITERA", (payload) =>
      calcularPuertaMosquitera(payload),
    );
  }

  if (tipo === "fijo") {
    return runCalculation(req, res, "MOSQUITERO FIJO", (payload) =>
      calcularMosquiteroFijo(payload),
    );
  }

  return runCalculation(req, res, "MOSQUITEROS", (payload) =>
    calcularMosquiteroVentana(payload),
  );
}

// =========================
// 🪟 VENTANAS
// =========================

function ventanas(req, res) {
  const linea = req.body.linea?.toLowerCase();

  if (linea === "modena") {
    return runCalculation(req, res, "VENTANAS MODENA", (payload) =>
      calcularVentanaModena(payload),
    );
  }

  return runCalculation(req, res, "VENTANAS HERRERO", (payload) =>
    calcularVentanaHerrero(payload),
  );
}

function ventanasAbrir(req, res) {
  return runCalculation(req, res, "VENTANAS ABRIR", (payload) =>
    calcularVentanaAbrir(payload),
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
    return runCalculation(req, res, "RAJAS MODENA", (payload) =>
      calcularRajaModena(payload),
    );
  }

  return runCalculation(req, res, "RAJAS HERRERO", (payload) =>
    calcularRajaHerrero(payload),
  );
}

// =========================
// 🪵 POSTIGONES
// =========================

function postigones(req, res) {
  return runCalculation(req, res, "POSTIGONES", (payload) =>
    calcularPostigones(payload),
  );
}

// =========================
// 🚪 PORTONES
// =========================

function portones(req, res) {
  return runCalculation(req, res, "PORTONES", (payload) =>
    calcularporton(payload),
  );
}

// =========================
// 🧱 SUPERFICIES
// =========================

function superficies(req, res) {
  return runCalculation(req, res, "SUPERFICIES", (payload) =>
    calcularsuperficies(payload),
  );
}

// =========================
// 🏔 PATAGONICAS
// =========================

function patagonicas(req, res) {
  console.log("REQ BODY PATAGONICAS:");
  console.log(req.body);

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

  console.log("PAYLOAD ARMADO:");
  console.log(payload);

  const calculadora =
    linea === "herrero" ? calcularPatagonicaHerrero : calcularPatagonicaModena;

  return runCalculation(req, res, "PATAGONICAS", (payload) =>
    calculadora(payload),
  );
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

  ventanasAbrir,

  superficies,
};
