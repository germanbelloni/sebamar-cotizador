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
//Helper
function buscarMedidaHerrero(medida) {
  if (dataHerrero.medidas[medida]) {
    return dataHerrero.medidas[medida];
  }

  const [ancho, alto] = medida.split("x").map(Number);

  if (alto < 100) {
    const medidaVieja = `${ancho}x0,${alto}`;

    if (dataHerrero.medidas[medidaVieja]) {
      return dataHerrero.medidas[medidaVieja];
    }
  }

  return null;
}
// =========================
// 🪟 HERRERO
// =========================
function calcularHerrero({
  medida,
  tipoVidrio = "3mm",
  incluirGuia,
  incluirMosquitero,
}) {
  const d = buscarMedidaHerrero(medida);

  if (!d) {
    throw new Error("Medida no encontrada");
  }

  // =========================
  // ITEMS
  // =========================

  const items = [];

  items.push(crearItem("estructura", Number(d.base || 0)));

  let precioVidrio = Number(d.vidrio || 0);

  if (tipoVidrio !== "3mm") {
    const [ancho, alto] = medida
      .split("x")
      .map((n) => Number(String(n).replace(",", ".")));

    const altoReal = alto < 1 ? alto * 100 : alto;

    const m2 = (ancho * altoReal) / 10000;

    precioVidrio = m2 * Number(superficies.vidrios?.[tipoVidrio] || 0);
  }

  items.push(crearItem("vidrio", Math.round(precioVidrio)));

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

    configuracion: {
      linea: "herrero",
      medida,
      incluirGuia: !!incluirGuia,
      incluirMosquitero: !!incluirMosquitero,
    },
  };
}

// =========================
// 🪟 MODENA
// =========================

function buscarMedidaModena(medida) {
  if (dataModena.medidas?.[medida]) {
    return {
      medida,
      datos: dataModena.medidas[medida],
    };
  }

  const [ancho, alto] = medida.split("x").map(Number);

  const medidaSuperior = Object.keys(dataModena.medidas)
    .map((m) => {
      const [w, h] = m.split("x").map(Number);

      return {
        key: m,
        w,
        h,
      };
    })
    .filter((m) => m.w >= ancho && m.h >= alto)
    .sort((a, b) => {
      if (a.h !== b.h) {
        return a.h - b.h;
      }

      return a.w - b.w;
    })[0];

  if (!medidaSuperior) {
    return null;
  }

  return {
    medida: medidaSuperior.key,
    datos: dataModena.medidas[medidaSuperior.key],
  };
}

function calcularModena({
  medida,
  tipoVidrio,
  incluirGuia,
  incluirMosquitero,
}) {
  const lookup = buscarMedidaModena(medida);

  if (!lookup) {
    throw new Error("Medida no encontrada");
  }

  const medidaUsada = lookup.medida;
  const d = lookup.datos;
  console.log({
    medidaPedida: medida,
    medidaUsada,
  });

  // =========================
  // ITEMS
  // =========================

  const items = [];

  items.push(crearItem("estructura", Number(d.base || 0)));

  let precioVidrio = Number(d.vidrios?.[tipoVidrio] || 0);

  if (tipoVidrio === "4+4") {
    const [ancho, alto] = medidaUsada
      .split("x")
      .map((n) => Number(String(n).replace(",", ".")));

    const altoReal = alto < 1 ? alto * 100 : alto;

    const m2 = (ancho * altoReal) / 10000;

    precioVidrio = m2 * Number(superficies.vidrios?.["4+4"] || 0);
  }

  if (tipoVidrio === "DVH 4+9+4") {
    precioVidrio =
      Number(d.vidrios?.["4mm"] || 0) * 2 + Number(d.vidrios?.dvh || 0);
  }

  if (tipoVidrio === "DVH 5+9+5") {
    precioVidrio =
      Number(d.vidrios?.["5mm"] || 0) * 2 + Number(d.vidrios?.dvh || 0);
  }

  items.push(crearItem("vidrio", Math.round(precioVidrio)));

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
