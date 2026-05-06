const { fromRoot } = require("../../backend/utils/path");

const calcularPuertaWrapper = require(
  fromRoot("wrappers/puertas/calcularPuerta"),
);

function calcularPuertaEco(dataInput) {
  return calcularPuertaWrapper({
    ...dataInput,
    linea: "eco",
  });
}

module.exports = calcularPuertaEco;