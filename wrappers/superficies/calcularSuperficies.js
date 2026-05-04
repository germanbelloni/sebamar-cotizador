const { fromRoot } = require("../../backend/utils/path");

const calcularSuperficie = require(
  fromRoot("services/superficies/Superficies"),
);
const perfiles = require(fromRoot("config/perfiles"));

function calcularSuperficiesWrapper(dataInput) {
  const { perfil = "amarilla", linea = "herrero" } = dataInput;

  const resultado = calcularSuperficie(dataInput);

  let total = resultado.costo;

  const perfilData = perfiles[perfil]?.[linea];

  if (!perfilData) {
    throw new Error(`Perfil inválido: ${perfil} - ${linea}`);
  }

  const costo = total;

  total *= 1 - perfilData.descuento;
  total *= 1 + perfilData.flete;
  total *= 1 + perfilData.ganancia;

  return {
    costo: Math.round(costo),
    total: Math.round(total),
    ganancia: Math.round(total - costo),
    detalle: resultado.detalle,
  };
}

module.exports = calcularSuperficiesWrapper;
