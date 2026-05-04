const { fromRoot } = require("../../backend/utils/path");

const calcularBase = require(
  fromRoot("backend/services/patagonicas/calcularPatagonicaHerrero"),
);

function calcularPatagonicaHerreroWrapper(dataInput) {
  const resultado = calcularBase(dataInput);

  return {
    total: resultado.total,
  };
}

module.exports = calcularPatagonicaHerreroWrapper;
