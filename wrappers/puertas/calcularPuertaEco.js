const { fromRoot } = require("../../backend/utils/path");

const calcularPuertas = require(fromRoot("services/puertas/calcularPuertas"));

function calcularPuertaEco(dataInput) {
  return calcularPuertas({
    ...dataInput,
    linea: "eco",
  });
}

module.exports = calcularPuertaEco;
