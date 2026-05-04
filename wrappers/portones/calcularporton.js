const { fromRoot } = require("../../backend/utils/path");

const calcularPortones = require(
  fromRoot("backend/services/portones/calcularPortones"),
);

const perfiles = require(fromRoot("config/perfiles"));

function calcularPortonWrapper(dataInput) {
  const { perfil = "amarilla", linea } = dataInput;

  const resultado = calcularPortones(dataInput);

  let total = resultado.costo;

  const perfilData = perfiles[perfil]?.[linea] || perfiles["amarilla"][linea];

  total *= 1 - perfilData.descuento;
  total *= 1 + perfilData.flete;
  total *= 1 + perfilData.ganancia;

  return {
    total: Math.round(total),
    costo: resultado.costo,
    ganancia: Math.round(total - resultado.costo),
  };
}

module.exports = calcularPortonWrapper;
