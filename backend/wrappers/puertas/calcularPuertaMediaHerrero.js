const { fromRoot } = require("../../utils/path");

const calcularBase = require(
  fromRoot("services/puertas/calcularPuertaMediaHerrero"),
);

const colores = require(fromRoot("frontend/data/colores.json"));
const perfiles = require(fromRoot("config/perfiles"));

// helpers
function normalizar(txt) {
  return txt?.toString().toLowerCase().trim();
}

function getColorValor(color) {
  const c = colores.find((x) => normalizar(x.nombre) === normalizar(color));
  return c ? c.valor : 0;
}

// MAIN
function calcularPuertaMediaHerreroWrapper(dataInput) {
  const { modelo, tipoVidrio, color, perfil = "amarilla" } = dataInput;

  const resultadoBase = calcularBase({ modelo, tipoVidrio });

  let total = resultadoBase.base;

  // 🎨 COLOR
  const colorValor = getColorValor(color);
  total *= 1 + colorValor;

  // 📦 PERFIL
  const perfilData = perfiles[perfil]?.herrero || perfiles["amarilla"].herrero;

  total *= 1 - perfilData.descuento;
  total *= 1 + perfilData.flete;
  total *= 1 + perfilData.ganancia;

  return {
    total: Math.round(total),
    modelo,
  };
}

module.exports = calcularPuertaMediaHerreroWrapper;
