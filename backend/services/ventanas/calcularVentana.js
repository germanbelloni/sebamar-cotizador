// backend/services/ventanas/calcularVentana.js

const { fromRoot } = require("../../utils/path");

const superficies = require(
  fromRoot("backend/data/productos/superficies.json"),
);

const dataHerrero = require(
  fromRoot("backend/data/productos/ventanas_herrero.json"),
);

const dataModena = require(
  fromRoot("backend/data/productos/ventanas_modena.json"),
);

const buscarMedidaSuperior = require(
  fromRoot("backend/utils/buscarMedidaSuperior"),
);

const buscarMedidaInferior = require(
  fromRoot("backend/utils/buscarMedidaInferior"),
);

// =========================
// 🧠 HELPERS
// =========================

function crearItem(tipo, precio) {
  return {
    tipo,
    precio: Number(precio || 0),
  };
}

function sumarItems(items) {
  return items.reduce((acc, i) => acc + Number(i.precio || 0), 0);
}

// 💎 VIDRIO POR M²
function calcularPrecioVidrioPorM2(medida, tipoVidrio) {
  const [ancho, alto] = medida
    .split("x")
    .map((n) => Number(String(n).replace(",", ".")));

  const altoReal = alto < 1 ? alto * 100 : alto;

  const m2 = (ancho * altoReal) / 10000;

  const precioM2 = Number(superficies.vidrios?.[tipoVidrio] || 0);

  return Math.round(m2 * precioM2);
}

// =========================
// 🚀 MAIN
// =========================

function calcularVentana(dataInput) {
  const { linea = "herrero" } = dataInput;

  if (linea === "modena") {
    return calcularModena(dataInput);
  }

  return calcularHerrero(dataInput);
}

// =========================
// 🪟 HERRERO
// =========================

function buscarMedidaHerrero(medida) {
  return buscarMedidaSuperior(dataHerrero.medidas, medida);
}

function calcularHerrero({
  medida,
  tipoVidrio = "3mm",
  incluirGuia,
  incluirMosquitero,
}) {
  const lookup = buscarMedidaHerrero(medida);

  if (!lookup) {
    throw new Error("Medida no encontrada");
  }

  const medidaUsada = lookup.medida;
  const d = lookup.datos;

  // =========================
  // ITEMS
  // =========================

  const items = [];

  items.push(crearItem("estructura", Number(d.base || 0)));

  // El JSON de Herrero ya trae el precio
  // del vidrio 3mm correspondiente a la medida.
  let precioVidrio = Number(d.vidrio || 0);

  // Cualquier vidrio definido en superficies.json
  // se calcula por m².
  if (tipoVidrio !== "3mm" && superficies.vidrios?.[tipoVidrio]) {
    precioVidrio = calcularPrecioVidrioPorM2(medidaUsada, tipoVidrio);
  }

  items.push(crearItem("vidrio", precioVidrio));

  if (incluirGuia) {
    items.push(crearItem("guia", Number(d.guia || 0)));
  }

  if (incluirMosquitero) {
    items.push(crearItem("mosquitero", Number(d.mosquitero || 0)));
  }

  // =========================
  // RESPONSE
  // =========================

  return {
    costoBase: sumarItems(items),

    items,

    medidaUtilizada: medidaUsada,

    configuracion: {
      linea: "herrero",
      medida: medidaUsada,
      incluirGuia: !!incluirGuia,
      incluirMosquitero: !!incluirMosquitero,
    },
  };
}

// =========================
// 🪟 MODENA
// =========================

function buscarMedidaModena(medida) {
  return buscarMedidaSuperior(dataModena.medidas, medida);
}

function calcularModena({
  medida,
  tipoVidrio,
  incluirGuia,
  incluirMosquitero,
  usarMedidaInferior = false,
}) {
  const lookup = usarMedidaInferior
    ? buscarMedidaInferior(dataModena.medidas, medida)
    : buscarMedidaModena(medida);

  if (!lookup) {
    throw new Error("Medida no encontrada");
  }

  const medidaUsada = lookup.medida;
  const d = lookup.datos;

  // =========================
  // ITEMS
  // =========================

  const items = [];

  items.push(crearItem("estructura", Number(d.base || 0)));

  // Valor base del JSON.
  // Se mantiene para los casos que no sean
  // vidrios por m² ni DVH.
  let precioVidrio = Number(d.vidrios?.[tipoVidrio] || 0);

  // =========================
  // VIDRIOS POR M²
  // =========================

  const esDVH = tipoVidrio === "DVH 4+9+4" || tipoVidrio === "DVH 5+9+5";

  if (!esDVH && superficies.vidrios?.[tipoVidrio]) {
    precioVidrio = calcularPrecioVidrioPorM2(medidaUsada, tipoVidrio);
  }

  // =========================
  // DVH
  // =========================
  // Se mantiene la lógica existente.
  // NO tocar.

  if (tipoVidrio === "DVH 4+9+4") {
    precioVidrio =
      Number(d.vidrios?.["4mm"] || 0) * 2 + Number(d.vidrios?.dvh || 0);
  }

  if (tipoVidrio === "DVH 5+9+5") {
    precioVidrio =
      Number(d.vidrios?.["5mm"] || 0) * 2 + Number(d.vidrios?.dvh || 0);
  }

  items.push(crearItem("vidrio", precioVidrio));

  if (incluirGuia) {
    items.push(crearItem("guia", Number(d.guia || 0)));
  }

  if (incluirMosquitero) {
    items.push(crearItem("mosquitero", Number(d.mosquitero || 0)));
  }

  // =========================
  // RESPONSE
  // =========================

  return {
    costoBase: sumarItems(items),

    items,

    medidaUtilizada: medidaUsada,

    configuracion: {
      linea: "modena",
      medida: medidaUsada,
      tipoVidrio,
      incluirGuia: !!incluirGuia,
      incluirMosquitero: !!incluirMosquitero,
    },
  };
}

module.exports = calcularVentana;
