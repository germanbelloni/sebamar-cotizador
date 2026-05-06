const { fromRoot } = require("../../utils/path");

const dataHerrero = require(
  fromRoot("frontend/data/productos/ventanas_herrero.json"),
);

const dataModena = require(
  fromRoot("frontend/data/productos/ventanas_modena.json"),
);

function calcularVentana(dataInput) {
  const { linea = "herrero" } = dataInput;

  if (linea === "modena") return calcularModena(dataInput);
  return calcularHerrero(dataInput);
}

// =========================
// HERRERO
// =========================
function calcularHerrero({ medida, incluirGuia, incluirMosquitero }) {
  const d = dataHerrero.medidas?.[medida];
  if (!d) throw new Error("Medida no encontrada");

  const items = [];

  items.push({ tipo: "base", precio: d.base });
  items.push({ tipo: "vidrio", precio: d.vidrio || 0 });

  if (incluirGuia) items.push({ tipo: "guia", precio: d.guia });
  if (incluirMosquitero)
    items.push({ tipo: "mosquitero", precio: d.mosquitero });

  const costoBase = items.reduce((a, i) => a + i.precio, 0);

  return {
    costoBase,
    items,
    descripcionBase: "Ventana herrero",
    configuracion: {},
  };
}

// =========================
// MODENA
// =========================
function calcularModena({
  medida,
  tipoVidrio,
  incluirGuia,
  incluirMosquitero,
}) {
  const d = dataModena.medidas?.[medida];
  if (!d) throw new Error("Medida no encontrada");

  const vidrio = d.vidrios?.[tipoVidrio] || 0;

  const items = [
    { tipo: "base", precio: d.base },
    { tipo: "vidrio", precio: vidrio },
  ];

  if (incluirGuia) items.push({ tipo: "guia", precio: d.guia });
  if (incluirMosquitero)
    items.push({ tipo: "mosquitero", precio: d.mosquitero });

  const costoBase = items.reduce((a, i) => a + i.precio, 0);

  return {
    costoBase,
    items,
    descripcionBase: "Ventana modena",
    configuracion: {},
  };
}

module.exports = calcularVentana;
