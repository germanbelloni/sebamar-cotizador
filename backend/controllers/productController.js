const calcularMosquitero = require("../services/mosquiteros/calcularMosquitero");
const calcularPatagonicaHerrero = require("../services/patagonicas/calcularPatagonicaHerrero");
const calcularPatagonicaModena = require("../services/patagonicas/calcularPatagonicaModena");
const calcularPostigon = require("../services/postigones/calcularPostigon");
const calcularPuerta = require("../services/puertas/calcularPuerta");
const calcularRaja = require("../services/rajas/calcularRaja");
const calcularVentana = require("../services/ventanas/calcularVentana");
const calcularMosquiteroVentana = require("../wrappers/mosquiteros/calcularMosquiteroVentana");
const calcularPuertaMosquitera = require("../wrappers/mosquiteros/calcularPuertaMosquitera");
const calcularPuertaPlaca = require("../wrappers/placas/calcularPuertaPlaca");
const calcularPuertaEco = require("../wrappers/puertas/calcularPuertaEco");
const calcularPuertaMediaHerrero = require("../wrappers/puertas/calcularPuertaMediaHerrero");
const calcularPuertaMediaModena = require("../wrappers/puertas/calcularPuertaMediaModena");
const calcularRajaModena = require("../wrappers/rajas/calcularRajaModena");
const calcularVentanaHerrero = require("../wrappers/ventanas/calcularVentanaHerrero");

function runCalculation(res, label, calculate) {
  try {
    return res.json(calculate());
  } catch (error) {
    console.log(`ERROR ${label}:`, error.message);

    return res.status(500).json({
      error: "Error en calculo",
      detalle: error.message,
    });
  }
}

function puertas(req, res) {
  const { linea, tipo } = req.body;

  if (!linea) {
    return res.status(400).json({ error: "Falta linea" });
  }

  return runCalculation(res, "PUERTAS", () =>
    calcularPuerta({ ...req.body, tipo: tipo || "simple" }),
  );
}

function mosquiteros(req, res) {
  const { ancho, alto } = req.body;

  if (!ancho || !alto) {
    return res.status(400).json({ error: "Faltan ancho o alto" });
  }

  return runCalculation(res, "MOSQUITEROS", () =>
    calcularMosquiteroVentana(req.body),
  );
}

function puertaMosquitera(req, res) {
  const { ancho, alto } = req.body;

  if (!ancho || !alto) {
    return res.status(400).json({ error: "Faltan ancho o alto" });
  }

  return runCalculation(res, "PUERTA MOSQUITERA", () =>
    calcularPuertaMosquitera({
      ancho: Number(ancho),
      alto: Number(alto),
      color: req.body.color,
    }),
  );
}

function puertaMediaHerrero(req, res) {
  if (!req.body.modelo) {
    return res.status(400).json({ error: "Falta modelo" });
  }

  return runCalculation(res, "PUERTA MEDIA", () =>
    calcularPuertaMediaHerrero(req.body),
  );
}

function puertaMediaModena(req, res) {
  const { modelo80, modelo70 } = req.body;

  if (!modelo80 || !modelo70) {
    return res.status(400).json({ error: "Faltan modelos (80 y 70)" });
  }

  return runCalculation(res, "PUERTA MEDIA MODENA", () =>
    calcularPuertaMediaModena(req.body),
  );
}

function placas(req, res) {
  const { tipo, modelo, medida, marco } = req.body;

  if (!tipo || !modelo || !medida || !marco) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  return runCalculation(res, "PLACAS", () => calcularPuertaPlaca(req.body));
}

function puertasEco(req, res) {
  if (!req.body.modelo) {
    return res.status(400).json({ error: "Falta modelo" });
  }

  return runCalculation(res, "PUERTAS ECO", () => calcularPuertaEco(req.body));
}

function rajasModena(req, res) {
  return runCalculation(res, "RAJAS MODENA", () =>
    calcularRajaModena(req.body),
  );
}

function ventanasHerrero(req, res) {
  const debug = req.query.debug === "true";

  return runCalculation(res, "VENTANAS HERRERO", () =>
    calcularVentanaHerrero(req.body, { debug }),
  );
}

function ventanas(req, res) {
  if (!req.body.linea) {
    return res.status(400).json({ error: "Falta linea" });
  }

  return runCalculation(res, "VENTANAS", () => calcularVentana(req.body));
}

function rajas(req, res) {
  if (!req.body.linea) {
    return res.status(400).json({ error: "Falta linea" });
  }

  return runCalculation(res, "RAJAS", () => calcularRaja(req.body));
}

function postigones(req, res) {
  const { medida, tipo, color } = req.body;

  if (!medida || !tipo || !color) {
    return res.status(400).json({ error: "Faltan datos obligatorios" });
  }

  return runCalculation(res, "POSTIGONES", () => calcularPostigon(req.body));
}

function patagonicas(req, res) {
  const calculadora =
    req.body.linea === "herrero"
      ? calcularPatagonicaHerrero
      : calcularPatagonicaModena;

  return runCalculation(res, "PATAGONICAS", () => calculadora(req.body));
}

function mosquiterosBase(req, res) {
  const { ancho, alto } = req.body;

  if (!ancho || !alto) {
    return res.status(400).json({ error: "Faltan ancho o alto" });
  }

  return runCalculation(res, "MOSQUITEROS", () => calcularMosquitero(req.body));
}

module.exports = {
  mosquiteros,
  mosquiterosBase,
  patagonicas,
  placas,
  postigones,
  puertaMediaHerrero,
  puertaMediaModena,
  puertaMosquitera,
  puertas,
  puertasEco,
  rajas,
  rajasModena,
  ventanas,
  ventanasHerrero,
};
