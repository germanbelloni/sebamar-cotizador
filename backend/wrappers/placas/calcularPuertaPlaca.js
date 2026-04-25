const { fromRoot } = require("../../utils/path");

const calcularBase = require(fromRoot("services/placas/calcularPuertaPlaca"));

const perfiles = require(fromRoot("config/perfiles"));

// 🔹 MAIN
function calcularPuertaPlacaWrapper(dataInput) {
  const { perfil = "amarilla" } = dataInput;

  // 1. base (service)
  const resultadoBase = calcularBase(dataInput);

  let total = resultadoBase.base;

  // 2. perfil (AHORA CORRECTO)
  const perfilData = perfiles[perfil]?.placa || perfiles["amarilla"].placa;

  total *= 1 - perfilData.descuento;
  total *= 1 + perfilData.ganancia;

  return {
    total: Math.round(total),
  };
}

module.exports = calcularPuertaPlacaWrapper;
