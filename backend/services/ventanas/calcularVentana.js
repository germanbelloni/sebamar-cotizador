// backend/services/ventanas/calcularVentana.js

const { fromRoot } = require("../../utils/path");

const dataHerrero = require(
  fromRoot("frontend/data/productos/ventanas_herrero.json"),
);

const dataModena = require(
  fromRoot("frontend/data/productos/ventanas_modena.json"),
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

// =========================
// 🪟 HERRERO
// =========================

function calcularHerrero({ medida, incluirGuia, incluirMosquitero }) {
  const d = dataHerrero.medidas?.[medida];

  if (!d) {
    throw new Error("Medida no encontrada");
  }

  // =========================
  // ITEMS
  // =========================

  const items = [];

  items.push(crearItem("estructura", Number(d.base || 0)));

  items.push(crearItem("vidrio", Number(d.vidrio || 0)));

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

function calcularModena({
  medida,
  tipoVidrio,
  incluirGuia,
  incluirMosquitero,
}) {
  const d = dataModena.medidas?.[medida];

  if (!d) {
    throw new Error("Medida no encontrada");
  }

  // =========================
  // ITEMS
  // =========================

  const items = [];

  items.push(crearItem("estructura", Number(d.base || 0)));

  items.push(crearItem("vidrio", Number(d.vidrios?.[tipoVidrio] || 0)));

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
      medida,
      tipoVidrio,
      incluirGuia: !!incluirGuia,
      incluirMosquitero: !!incluirMosquitero,
    },
  };
}

module.exports = calcularVentana;
